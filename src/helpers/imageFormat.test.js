import { describe, it, expect } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import {
	isTransformableImage,
	isDecodableImage,
	isGifReference,
	shouldKeepGifOriginal,
} from "./imageFormat.js";

const writeTemp = (name, bytes) => {
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), "img-format-"));
	const file = path.join(dir, name);
	fs.writeFileSync(file, Buffer.from(bytes));
	return file;
};

// A real, decodable 1x1 GIF89a — not just a magic-byte stub.
const REAL_GIF = Buffer.from(
	"R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
	"base64",
);
const REAL_PNG = Buffer.from(
	"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
	"base64",
);

describe("isTransformableImage", () => {
	it("accepts a JPEG regardless of extension", () => {
		expect(
			isTransformableImage(writeTemp("photo.jpg", [0xff, 0xd8, 0xff, 0xe0])),
		).toBe(true);
	});

	it("accepts a PNG", () => {
		expect(
			isTransformableImage(
				writeTemp("img.png", [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
			),
		).toBe(true);
	});

	it("accepts a WebP", () => {
		const riff = [...Buffer.from("RIFF"), 0, 0, 0, 0, ...Buffer.from("WEBP")];
		expect(isTransformableImage(writeTemp("img.webp", riff))).toBe(true);
	});

	it("accepts a GIF", () => {
		expect(
			isTransformableImage(writeTemp("img.gif", Buffer.from("GIF89a"))),
		).toBe(true);
	});

	it("rejects a HEIC file renamed to .jpg", () => {
		// iPhone photos: 4-byte box size, then "ftypheic"
		const heic = [0, 0, 0, 24, ...Buffer.from("ftypheic"), 0, 0, 0, 0];
		expect(isTransformableImage(writeTemp("EyetotheEar.jpg", heic))).toBe(
			false,
		);
	});

	it("rejects arbitrary non-image bytes", () => {
		expect(
			isTransformableImage(
				writeTemp("fake.jpg", Buffer.from("hello, not an image")),
			),
		).toBe(false);
	});

	it("rejects a missing file", () => {
		expect(isTransformableImage("/nonexistent/img.jpg")).toBe(false);
	});
});

describe("isDecodableImage", () => {
	it("rejects a truncated AVIF that passes header sniffing", async () => {
		// Real-world case: a truncated AVIF renamed to .jpg has a valid
		// ftypavif header but cannot be decoded ("bad seek to ...").
		await expect(
			isDecodableImage(
				path.join(__dirname, "__fixtures__", "truncated.avif.jpg"),
			),
		).resolves.toBe(false);
	});

	it("accepts a real decodable image", async () => {
		await expect(
			isDecodableImage("src/site/img/tree-1.svg").then(Boolean),
		).resolves.toBe(false); // svg is not in scope for the optimizer

		// A valid 1x1 transparent PNG — small but fully decodable.
		const png = Buffer.from(
			"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
			"base64",
		);
		await expect(isDecodableImage(writeTemp("real.png", png))).resolves.toBe(
			true,
		);
	});

	it("rejects HEIC content without invoking a decode", async () => {
		const heic = [0, 0, 0, 24, ...Buffer.from("ftypheic"), 0, 0, 0, 0];
		await expect(
			isDecodableImage(writeTemp("photo.jpg", heic)),
		).resolves.toBe(false);
	});

	it("rejects a missing file", async () => {
		await expect(isDecodableImage("/nonexistent/img.jpg")).resolves.toBe(
			false,
		);
	});
});

describe("isGifReference", () => {
	it("accepts a plain .gif path", () => {
		expect(isGifReference("/img/wave.gif")).toBe(true);
	});

	it("is case-insensitive", () => {
		for (const ref of ["/img/wave.GIF", "/img/Wave.Gif", "/img/wave.gIf"]) {
			expect(isGifReference(ref)).toBe(true);
		}
	});

	it("ignores query strings and fragments", () => {
		expect(isGifReference("/img/wave.gif?raw=1")).toBe(true);
		expect(isGifReference("/img/wave.gif#top")).toBe(true);
		expect(isGifReference("/img/wave.gif?v=2&x=1#top")).toBe(true);
	});

	it("does not treat a .gif inside the query string as the format", () => {
		expect(isGifReference("/img/photo.jpg?fallback=wave.gif")).toBe(false);
		expect(isGifReference("/img/photo.jpg#wave.gif")).toBe(false);
	});

	it("rejects other image formats", () => {
		for (const ref of [
			"/img/photo.webp",
			"/img/photo.jpeg",
			"/img/photo.jpg",
			"/img/photo.png",
			"/img/icon.svg",
			"/img/gif",
			"/img/wave.gif.jpg",
			"",
			undefined,
			null,
		]) {
			expect(isGifReference(ref)).toBe(false);
		}
	});
});

describe("shouldKeepGifOriginal", () => {
	it("keeps a GIF original instead of optimizing it", () => {
		expect(shouldKeepGifOriginal(writeTemp("wave.gif", REAL_GIF))).toBe(true);
	});

	it("keeps an upper-case .GIF original", () => {
		expect(shouldKeepGifOriginal(writeTemp("wave.GIF", REAL_GIF))).toBe(true);
	});

	it("keeps a .gif reference that carries a query string", () => {
		const file = writeTemp("wave.gif", REAL_GIF);
		expect(shouldKeepGifOriginal(`${file}?v=2`)).toBe(true);
	});

	it("keeps GIF content stored under a non-GIF extension", () => {
		expect(shouldKeepGifOriginal(writeTemp("wave.png", REAL_GIF))).toBe(true);
		expect(shouldKeepGifOriginal(writeTemp("wave", REAL_GIF))).toBe(true);
	});

	it("still optimizes non-GIF images", () => {
		expect(shouldKeepGifOriginal(writeTemp("photo.png", REAL_PNG))).toBe(
			false,
		);
		expect(
			shouldKeepGifOriginal(writeTemp("photo.jpg", [0xff, 0xd8, 0xff, 0xe0])),
		).toBe(false);
		const riff = [...Buffer.from("RIFF"), 0, 0, 0, 0, ...Buffer.from("WEBP")];
		expect(shouldKeepGifOriginal(writeTemp("photo.webp", riff))).toBe(false);
		expect(
			shouldKeepGifOriginal(writeTemp("fake.jpg", Buffer.from("not an image"))),
		).toBe(false);
	});

	it("keeps a .gif path even when the file cannot be read", () => {
		expect(shouldKeepGifOriginal("/nonexistent/wave.gif")).toBe(true);
		expect(shouldKeepGifOriginal("/nonexistent/wave.jpg")).toBe(false);
	});
});
