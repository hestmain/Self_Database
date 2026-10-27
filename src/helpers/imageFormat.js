const fs = require("fs");
const { createRequire } = require("module");

// Use the exact sharp instance eleventy-img uses, so "can we decode this?"
// always agrees with what the optimization pipeline can actually do.
let sharp;
try {
	sharp = createRequire(require.resolve("@11ty/eleventy-img"))("sharp");
} catch {
	sharp = require("sharp");
}

/**
 * Read the first `length` bytes of a file, or null when it cannot be read.
 * Every probe below starts by sniffing magic bytes, so they all share this.
 */
function readHeader(filePath, length) {
	try {
		const fd = fs.openSync(filePath, "r");
		try {
			const header = Buffer.alloc(length);
			fs.readSync(fd, header, 0, length, 0);
			return header;
		} finally {
			fs.closeSync(fd);
		}
	} catch {
		return null;
	}
}

/**
 * Check whether a file's actual content is an image format the sharp-based
 * optimization pipeline can decode, by sniffing magic bytes. Extensions
 * lie — e.g. iPhone HEIC photos renamed to .jpg — and feeding sharp an
 * undecodable file fails the whole Eleventy build via an unhandled
 * rejection. Unknown or unreadable files return false so the caller can
 * leave the original <img> untouched.
 */
function isTransformableImage(filePath) {
	const header = readHeader(filePath, 16);

	if (!header) {
		return false;
	}

	// JPEG
	if (header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff) {
		return true;
	}

	// PNG
	if (header.subarray(0, 8).equals(Buffer.from("\x89PNG\r\n\x1a\n", "latin1"))) {
		return true;
	}

	// GIF87a / GIF89a
	const ascii = header.toString("latin1");
	if (ascii.startsWith("GIF87a") || ascii.startsWith("GIF89a")) {
		return true;
	}

	// WebP: RIFF....WEBP
	if (ascii.startsWith("RIFF") && ascii.slice(8, 12) === "WEBP") {
		return true;
	}

	// TIFF (also the container some raw formats use)
	if (ascii.startsWith("II*\x00") || ascii.startsWith("MM\x00*")) {
		return true;
	}

	// AVIF: ISO-BMFF ftyp box with an avif brand — sharp decodes these.
	// Other ftyp brands (heic, heix, mif1…) are HEIC/HEIF: not decodable.
	if (ascii.slice(4, 8) === "ftyp") {
		return ascii.slice(8, 12) === "avif";
	}

	return false;
}

// Probe results memoized per file version — decoding is the expensive part
// and the same image is typically referenced from many pages.
const decodableCache = new Map();

/**
 * Check whether sharp can actually decode a file, by decoding it.
 *
 * Header sniffing (isTransformableImage) is a fast first filter, but a
 * valid header proves nothing about the bitstream: a truncated AVIF still
 * says "ftypavif" yet fails mid-decode, and eleventy-img leaves internal
 * promise rejections unhandled on decode failure, which kills the whole
 * Eleventy build. Only files that pass a real decode may enter the
 * optimization pipeline.
 */
async function isDecodableImage(filePath) {
	if (!isTransformableImage(filePath)) {
		return false;
	}

	let cacheKey;

	try {
		const stat = fs.statSync(filePath);
		cacheKey = `${filePath}:${stat.mtimeMs}:${stat.size}`;
	} catch {
		return false;
	}

	if (decodableCache.has(cacheKey)) {
		return decodableCache.get(cacheKey);
	}

	const probe = sharp(filePath)
		.stats()
		.then(
			() => true,
			(err) => {
				console.warn(
					`[image] ${filePath} cannot be decoded and will not be optimized: ${err.message.split("\n")[0]}`,
				);

				return false;
			},
		);

	decodableCache.set(cacheKey, probe);

	return probe;
}

/**
 * Strip a URL query string and fragment from an image reference, so the
 * extension checks below look at the path only: "/img/anim.gif?v=2" and
 * "/img/anim.gif#top" both point at the same file.
 */
function pathOnly(ref) {
	if (typeof ref !== "string") {
		return "";
	}

	return ref.split("#")[0].split("?")[0].trim();
}

/**
 * Case-insensitive, query/fragment-safe test for a ".gif" reference or path.
 */
function isGifReference(ref) {
	return /\.gif$/i.test(pathOnly(ref));
}

/**
 * Check whether an image must be published as its original file instead of
 * going through the WebP/JPEG optimizer.
 *
 * Every format the optimizer emits is a single still frame, so optimizing an
 * animated GIF freezes it at frame one — the animation is silently lost.
 * GIFs therefore keep their original file and <img> tag.
 *
 * The extension decides first, so the answer holds for unreadable files and
 * for any letter case; the magic bytes then catch GIFs stored under a
 * misleading or missing extension.
 */
function shouldKeepGifOriginal(filePath) {
	if (isGifReference(filePath)) {
		return true;
	}

	const header = readHeader(filePath, 6);

	if (!header) {
		return false;
	}

	const ascii = header.toString("latin1");

	return ascii === "GIF87a" || ascii === "GIF89a";
}

module.exports = {
	isTransformableImage,
	isDecodableImage,
	isGifReference,
	shouldKeepGifOriginal,
};
