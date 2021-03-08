let p = new vec2(384.0, 128.0);
let p1 = new vec2(128.0, 384.0);

make_draggable_point(demo.drag_control, p);

demo.on_draw.push((c) =>
		{

		const arw = new arrow2(p1, p);

		const po0 = new point2(p);

		let red_style = default_style.copy();
		red_style.stroke_style = "#FF0000";
		red_style.fill_style = "#FF0000";

		point2.draw(c, po0, red_style);

		arrow2.draw(c, arw, default_style);

		c.font = "16px sans-serif";
		c.fillText('p', p.x + 8.0, p.y + 2.0);
		c.fillText('(0, 0)', p1.x + 8.0, p1.y + 8.0);
		});
