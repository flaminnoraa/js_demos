# Points as vectors

While points are not vectors, they can be represented as the vector from the **origin** of $(0, 0, 0)$ to the point.

We can for convenience use point $p$ to mean the vector $(p - o)$ in equations.

So they could be implemented as a struct:

``` c++
struct point
{
	vector p;
};
```
