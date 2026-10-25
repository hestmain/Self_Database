---
{"dg-publish":true,"permalink":"/复变函数/例题/解析性与C-R方程/","tags":["复变函数/例题","复变函数/第2章","复变函数/第4章"],"dg-note-properties":{"tags":["复变函数/例题","复变函数/第2章","复变函数/第4章"],"aliases":["C-R方程例题","解析性例题"]}}
---


本篇汇集 [[复变函数/概念/极坐标形式的C-R方程\|极坐标形式的C-R方程]] 与 [[复变函数/概念/解析函数的导数公式\|解析函数的导数公式]] 两篇概念笔记中的例题：前者演示在极坐标下验证 C-R 方程并读出导数，后者演示反用高阶导数公式计算围道积分。

## 极坐标形式的C-R方程

取 $z = r e^{\mathrm{i}\theta}$，$u = \ln r$、$v = \theta$，即在割去负实轴的区域 $D$ 内取 $f(z) = \ln z = \ln\left|z\right| + \mathrm{i}\arg z$。计算得
$$
u_{r} = \frac{1}{r},\quad u_{\theta} = 0,\qquad v_{r} = 0,\quad v_{\theta} = 1
$$
代入方程：$\dfrac{1}{r} = \dfrac{1}{r}\cdot 1$，$0 = -\dfrac{1}{r}\cdot 0$，两条都成立，所以 $f$ 在 $D$ 内解析，并且
$$
f^{\prime}(z) = e^{-\mathrm{i}\theta}\left(\frac{1}{r} + \mathrm{i}\cdot 0\right) = \frac{1}{r e^{\mathrm{i}\theta}} = \frac{1}{z}
$$
这正是 [[复变函数/概念/对数函数\|对数函数]] 中"$\ln z$ 的导数为 $\dfrac{1}{z}$"的独立验证。注意 $u = \ln r$ 只依赖 $r$，所以 $\ln\left|z\right|$ 在去心平面 $\mathbb{C}\setminus\{0\}$ 上处处是[[复变函数/概念/调和函数\|调和函数]]：用极坐标下的 Laplacian
$$
u_{rr} + \frac{1}{r}u_{r} + \frac{1}{r^{2}}u_{\theta\theta} = -\frac{1}{r^{2}} + \frac{1}{r}\cdot\frac{1}{r} + 0 = 0
$$
而单值的 $\arg z$ 只能在割去射线的区域上取得，这正是 $\ln z$ 的[[复变函数/概念/解析\|解析]]区域必须挖掉一条射线的理由。这也说明 $u = \ln\left|z\right|$ 的调和性不需要任何割线，而它的共轭调和函数 $\arg z$ 却需要，多值性带来的差别正体现在这里。

## 解析函数的导数公式

计算 $\displaystyle\oint_{|z|=1}\frac{e^z}{z^3}\,\mathrm{d}z$。这里 $f(z)=e^z$（整函数），$z_0=0$，$n=2$，$f''(0)=e^0=1$：
$$\oint_{|z|=1}\frac{e^z}{z^3}\,\mathrm{d}z=\frac{2\pi\mathrm{i}}{2!}\cdot 1=\pi\mathrm{i}$$
再如 $\displaystyle\oint_{|z|=2}\frac{\cos z}{z^4}\,\mathrm{d}z=\frac{2\pi\mathrm{i}}{3!}\left.\frac{\mathrm{d}^3}{\mathrm{d}z^3}\cos z\right|_{z=0}=\frac{2\pi\mathrm{i}}{6}\cdot 0=0$（因为 $\cos$ 的三阶导数是 $-\sin$，在 $0$ 处为 $0$）。

## 相关笔记

- [[复变函数/概念/极坐标形式的C-R方程\|极坐标形式的C-R方程]]：$(r,\theta)$ 下的 C-R 方程与导数公式
- [[复变函数/概念/解析函数的导数公式\|解析函数的导数公式]]：高阶导数公式与反用公式计算积分

> 教材 §22、§48
