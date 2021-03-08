p = new vec2(256.0, 128.0);
p1 = new vec2(192.0, 192.0);

demo.drag_control.draggables.push(new draggable((pos) =>
			{
			}, (pos) =>
			{
			}, (pos) =>
			{
			p = pos.copy();
			}, new circle_hit_shape(p, 6.0)));

demo.drag_control.draggables.push(new draggable((pos) => { }, (pos) => { },
			(pos) =>
			{
			p1 = pos.copy();
			}, new circle_hit_shape(p1, 6.0)));

demo.on_draw.push((c, freeze) =>
		{
		const arw = new arrow2(p, p1);

		arrow2.draw(c, arw, default_style);

		});
