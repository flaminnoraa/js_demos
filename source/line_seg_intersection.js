let p0 = new vec2(128.0, 128.0);
let p1 = new vec2(384.0, 256.0);
let p2 = new vec2(128.0, 384.0);
let p3 = new vec2(384.0, 128.0);

make_draggable_point(demo.drag_control, p0);
make_draggable_point(demo.drag_control, p1);
make_draggable_point(demo.drag_control, p2);
make_draggable_point(demo.drag_control, p3);

demo.on_draw.push((c) =>
{
	const v0 = (vec2.sub(p1, p0));
	const v1 = (vec2.sub(p3, p2));

	const ls0 = new line_seg2(p0, p1);
	const ls1 = new line_seg2(p2, p3);

	const vxu = vec2.cross(v0, v1);

	let c0 = p0;
	let c1 = p2;

	let hit = false;

	if(vxu != 0.0)
	{
		const qp = vec2.sub(p2, p0);
		const qpxu = vec2.cross(qp, v0);

		if(qpxu != 0.0)
		{
			const qpxv = vec2.cross(qp, v1);
			const qpxu = vec2.cross(qp, v0);
			const t = qpxv / vxu;
			const s = qpxu / vxu;

			if(t > 0.0 && t < 1.0 && s > 0.0 && s < 1.0)
			{
				hit = true;
			}
			c0 = vec2.add(p0, vec2.scale(v0, t));
		}
	}

	const po0 = new point2(c0);
	const po1 = new point2(c1);

	const arw0 = new arrow2(p0, c0);
	const arw1 = new arrow2(p2, c0);

	let red_style = default_style.copy();
	red_style.stroke_style = '#FF0000';

	let grey_style = default_style.copy();
	grey_style.stroke_style = '#999999';
	grey_style.line_width = 1.0;

	let line_style = red_style.copy();
	line_style.line_width = 1.0;

	const m0 = (vec2.midpoint(p0, p1));
	const m1 = (vec2.midpoint(p0, p2));
	const m2 = (vec2.midpoint(p0, p3));

	line_seg2.draw(c, ls0, line_style);
	line_seg2.draw(c, ls1, line_style);

	c.font = "16px sans-serif";
	if(hit === true)
	{
		arrow2.draw(c, arw1, default_style);
		arrow2.draw(c, arw0, default_style);
		point2.draw(c, po0, default_style);
		c.fillText('p + tv', c0.x - 48.0, c0.y);
	}


	c.fillText('p', p0.x - 16.0, p0.y);
	c.fillText('q', p2.x, p2.y + 16.0);

});

