---
{"dg-publish":true,"permalink":"/复变函数/概念/C-R方程/","tags":["复变函数/第2章"],"dg-note-properties":{"tags":["复变函数/第2章"],"aliases":["柯西-黎曼方程","Cauchy-Riemann 方程","CR 方程"]}}
---


若复变函数 $f(z) = u(x,y) + \mathrm{i}v(x,y)$ 在 $z_0$ 处[[复变函数/概念/微分\|可微]]，则其实部与虚部并不独立：在 $(x_0,y_0)$ 处必须满足 C-R（Cauchy–Riemann）方程
$$
\frac{\partial u}{\partial x} = \frac{\partial v}{\partial y},
\qquad
\frac{\partial u}{\partial y} = -\frac{\partial v}{\partial x}
$$

## 必要性

设 $f(z) = u(x,y) + \mathrm{i}v(x,y)$ 在 $z_0 = x_0 + \mathrm{i}y_0$ 处可微（可导），则 $u(x,y)$ 与 $v(x,y)$ 在 $(x_0,y_0)$ 处的偏导数都存在，且在该点满足 C-R 方程
$$
u_{x} = v_{y},\qquad u_{y} = -v_{x}
$$

## 充分性

设 $u(x,y)$ 与 $v(x,y)$ 在 $(x_0,y_0)$ 的某个邻域内有定义，其偏导数 $u_{x}, u_{y}, v_{x}, v_{y}$ 在 $(x_0,y_0)$ 处存在且连续，并且在该点满足 C-R 方程 $u_{x} = v_{y}$、$u_{y} = -v_{x}$，则 $f(z) = u(x,y) + \mathrm{i}v(x,y)$ 在 $z_0$ 处可微（可导），且
$$
f^{\prime}(z_0) = u_{x} + \mathrm{i}v_{x} = v_{y} - \mathrm{i}u_{y}
$$

> [!warning] 两个前提都不能少
> “偏导数存在 + C-R 方程”本身不足以保证可微，还需要偏导数连续（或直接设 $u,v$ 可微）；而必要性只要求可微，并不要求偏导数连续。

## 极坐标形式

在极坐标 $z = r e^{\mathrm{i}\theta}$ 下，C-R 方程与导数写成
$$
u_{r} = \frac{1}{r}v_{\theta},\qquad v_{r} = -\frac{1}{r}u_{\theta},\qquad f^{\prime}(z) = e^{-\mathrm{i}\theta}\left(u_{r} + \mathrm{i}v_{r}\right)
$$
推导与用法见 [[复变函数/概念/极坐标形式的C-R方程\|极坐标形式的C-R方程]]。

## 几何意义

设 $f$ 在 $z_0$ 可微且 $f^{\prime}(z_0) \neq 0$，则它的线性化（Jacobi 矩阵）在 C-R 方程下形如
$$
\begin{pmatrix} u_{x} & u_{y} \\ v_{x} & v_{y} \end{pmatrix}
=
\begin{pmatrix} a & -b \\ b & a \end{pmatrix},
\qquad a = u_{x},\ b = v_{x}
$$
即“乘以复数 $a + \mathrm{i}b = f^{\prime}(z_0)$”。于是 $f$ 在 $z_0$ 附近把每个小图形统一伸缩 $\left|f^{\prime}(z_0)\right|$ 倍并旋转 $\arg f^{\prime}(z_0)$，因此过 $z_0$ 的任意两条曲线在映射后夹角不变——这就是解析函数的保角性。

> 教材 §20–§21
