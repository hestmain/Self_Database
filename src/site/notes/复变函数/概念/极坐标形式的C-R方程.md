---
tags:
  - 复变函数/第2章
aliases:
  - 极坐标 C-R 方程
  - 极坐标下的柯西-黎曼方程
dg-publish: true
permalink: "/复变函数/概念/极坐标形式的C-R方程/"
---

许多函数写成极坐标 $z = r e^{\mathrm{i}\theta}$ 后形式最简，例如 $\ln\left|z\right|$、$\arg z$、$z^{n}$。此时若先转回直角坐标再套 [C-R方程](C-R方程.md)，展开计算会很繁琐；把 C-R 方程本身用 $(r,\theta)$ 写出，就能直接在极坐标下判断[解析](解析.md)性。

## 极坐标下的 C-R 方程

设 $f(z) = u(r,\theta) + \mathrm{i}v(r,\theta)$，其中 $z = r e^{\mathrm{i}\theta}$ 且 $r > 0$，则 $f$ 可微当且仅当 $u, v$ 作为 $(r,\theta)$ 的函数可微，并且
$$
u_{r} = \frac{1}{r}v_{\theta},\qquad v_{r} = -\frac{1}{r}u_{\theta}
$$
也可逐项写出：
$$
\frac{\partial u}{\partial r} = \frac{1}{r}\frac{\partial v}{\partial \theta},\qquad
\frac{\partial v}{\partial r} = -\frac{1}{r}\frac{\partial u}{\partial \theta}
$$
与直角坐标的 $u_{x} = v_{y}$、$u_{y} = -v_{x}$ 只差一个因子 $\dfrac{1}{r}$。

> [!warning] 只在 $r > 0$ 处有效
> 因子 $\dfrac{1}{r}$ 在 $z = 0$ 处失效，极坐标形式的 C-R 方程不能用来讨论原点处的可微性。它适用的区域总是不含原点的

## 导数公式

在满足上述方程的点处，导数有两个等价写法：
$$
f^{\prime}(z) = e^{-\mathrm{i}\theta}\left(u_{r} + \mathrm{i}v_{r}\right)
= \frac{1}{\mathrm{i}z}\left(u_{\theta} + \mathrm{i}v_{\theta}\right)
$$
推导思路：由 $x = r\cos\theta$、$y = r\sin\theta$ 用链式法则把 $u_{r}, u_{\theta}$ 表示成 $u_{x}, u_{y}$ 的组合（$v$ 同理），代入直角坐标的 $f^{\prime}(z) = u_{x} + \mathrm{i}v_{x}$，再用 C-R 方程消去 $u_{y}, v_{y}$，即得第一式；把 $u_{\theta}, v_{\theta}$ 的链式法则表达式乘以 $\dfrac{1}{\mathrm{i}z} = \dfrac{e^{-\mathrm{i}\theta}}{\mathrm{i}r}$ 并整理，就得到第二式。两式在极坐标下分别对应"沿径向求导"和"沿角向求导"两种看法。

## 用途

极坐标形式的优点是：函数的实部、虚部若天然以 $r, \theta$ 表出，就不必展开成 $x, y$ 的多项式。常见做法是直接算出 $u_{r}, u_{\theta}, v_{r}, v_{\theta}$，验证两条方程是否处处成立，成立则 $f$ 在该区域内解析，并可顺手读出 $f^{\prime}(z)$。

以 $f(z) = z^{n}$ 为例，$u = r^{n}\cos n\theta$、$v = r^{n}\sin n\theta$，于是
$$
u_{r} = n r^{n-1}\cos n\theta = \frac{1}{r}v_{\theta},\qquad
v_{r} = n r^{n-1}\sin n\theta = -\frac{1}{r}u_{\theta}
$$
两条方程在不含原点的区域上处处成立（$n \geq 1$ 时在整个 $\mathbf{C}$ 上成立），故 $z^{n}$ 解析，且 $f^{\prime}(z) = e^{-\mathrm{i}\theta}\cdot n r^{n-1}e^{\mathrm{i}n\theta} = n z^{n-1}$，与 [幂函数](幂函数.md) 的结论一致。

> [!tip] 判据选择
> 实部虚部含 $\left|z\right|$、$\arg z$ 或写成 $r^{n}\cos n\theta$ 形式时优先用极坐标形式；含 $x, y$ 的多项式时用直角坐标的 [C-R方程](C-R方程.md) 更快。两者是同一组条件的两种写法，结论必须一致。

## 例题

见 [解析性与C-R方程](../例题/解析性与C-R方程.md#极坐标形式的C-R方程)。

> 教材 §22
