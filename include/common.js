// Drawing styles
class draw_style
{
	line_width = 2.0;
	arrow_head = "triangle";
	arrow_tail = "dot";
	arrow_dot_radius = 4.0;
	arrow_head_length = 10.0;
	arrow_head_width = 5.0;

	point_radius = 4.0;

	angle_radius = 32.0;

	stroke_style = "#000";
	fill_style = "#000";
	line_dash = [];

	apply(canv)
	{
		canv.strokeStyle = this.stroke_style;
		canv.fillStyle = this.fill_style;
		canv.lineWidth = this.line_width;
		canv.setLineDash(this.line_dash);
	}

	copy()
	{
		let new_style = new draw_style();
		new_style.line_width = this.line_width;
		new_style.arrow_head = this.arrow_head;
		new_style.arrow_tail = this.arrow_tail;
		new_style.arrow_dot_radius = this.arrow_dot_radius;
		new_style.arrow_head_length = this.arrow_head_length;
		new_style.arrow_head_width = this.arrow_head_width;
		new_style.stroke_style = this.stroke_style;
		new_style.fill_style = this.fill_style;
		new_style.line_dash = this.line_dash;
		new_style.point_radius = this.point_radius;
		return new_style;
	}
}

default_style = new draw_style();



// Geometric classes

class vec2
{
	x = 0.0;
	y = 0.0;

	constructor(x, y)
	{
		this.x = x;
		this.y = y;
	}

	static add(a, b)
	{
		return new vec2(a.x + b.x, a.y + b.y);	
	}

	static sub(a, b)
	{
		return new vec2(a.x - b.x, a.y - b.y);	
	}

	static mul(v, s)
	{
		return new vec2(v.x * s, v.y * s);
	}

	static scale(v, s)
	{
		return vec2.mul(v, s);
	}

	static div(v, s)
	{
		return new vec2(v.x / s, v.y / s);
	}

	static dot(a, b)
	{
		return a.x * b.x + a.y * b.y;
	}

	static cross(a, b)
	{
		return a.x * b.y - b.x * a.y;
	}

	static length_squared(a)
	{
		return vec2.dot(a, a);
	}

	static length(a)
	{
		return Math.sqrt(vec2.length_squared(a));
	}

	static normalize(a)
	{
		return vec2.div(a, vec2.length(a));
	}

	static project(a, b)
	{
		return vec2.mul(b, vec2.dot(a, b));
	}

	static reflect(a, b)
	{
		return vec2.sub(vec2.mul(vec2.project(a, b), 2.0), a);
	}

	static rotate(v, ang)
	{
		const rx = Math.cos(ang) * v.x - Math.sin(ang) * v.y;
		const ry = Math.cos(ang) * v.y + Math.sin(ang) * v.x;

		return new vec2(rx, ry);
	}

	static midpoint(a, b)
	{	
		return vec2.scale(vec2.add(a, b), 0.5);
	}

	copy()
	{
		return new vec2(this.x, this.y);
	}
}

class vec3
{
	x = 0.0;
	y = 0.0;
	z = 0.0;

	constructor(x, y, z)
	{
		this.x = x;
		this.y = y;
		this.z = z;
	}

	static add(a, b)
	{
		return new vec3(a.x + b.x, a.y + b.y, a.z + b.z);	
	}

	static sub(a, b)
	{
		return new vec3(a.x - b.x, a.y - b.y, a.z - b.z);	
	}

	static mul(v, s)
	{
		return new vec3(v.x * s, v.y * s, v.z * s);
	}

	static scale(v, s)
	{
		return vec3.mul(v, s);
	}

	static div(v, s)
	{
		return new vec3(v.x / s, v.y / s, v.z / s);
	}

	static dot(a, b)
	{
		return a.x * b.x + a.y * b.y + a.z * b.z;
	}

	static cross(a, b)
	{
		return new vec3(
			a.y * b.z - b.y * a.z,
			a.z * b.x - b.z * a.x,
			a.x * b.y - b.x * a.y
		);
	}

	static length_squared(a)
	{
		return vec3.dot(a, a);
	}

	static length(a)
	{
		return Math.sqrt(vec3.length_squared(a));
	}

	static normalize(a)
	{
		return vec3.div(a, vec3.length(a));
	}

	static project(a, b)
	{
		return vec3.mul(b, vec3.dot(a, b));
	}

	static reflect(a, b)
	{
		return vec3.sub(vec3.mul(vec3.project(a, b), 2.0), a);
	}

	static midpoint(a, b)
	{	
		return vec3.scale(vec3.add(a, b), 0.5);
	}

	copy()
	{
		return new vec3(this.x, this.y, this.z);
	}
}

class point2
{
	p;
	constructor(p)
	{
		this.p = p.copy();
	}

	static draw(canv, p, style)
	{
		canv.save();
		style.apply(canv);
		canv.beginPath();
		canv.arc(p.p.x, p.p.y, style.point_radius, 0, Math.PI * 2.0);
		canv.fill();
		canv.stroke();
		canv.restore();
	}
}

class point3
{
	p;
	constructor(p)
	{
		this.p = p.copy();
	}

	static draw(canv, view, p, style)
	{
		const pv = view.project(p.p);
		const p2 = new point2(pv);
		point2.draw(canv, p2, style);
	}
}

class line2
{
	p;
	v;
	constructor(p, v)
	{
		this.p = p;
		this.v = v;
	}

	static draw(canv, l, t_start, t_end, style)
	{
		canv.save();
		style.apply(canv);
		canv.beginPath();
		const start = vec2.add(l.p, vec2.mul(l.v, t_start));
		const end = vec2.add(l.p, vec2.mul(l.v, t_end));
		canv.moveTo(start.x, start.y);
		canv.lineTo(end.x, end.y);
		canv.stroke();
		canv.restore();
	}	
}

class line3
{
	p;
	v;
	constructor(p, v)
	{
		this.p = p;
		this.v = v;
	}

	static draw(canv, view, l, start, end, style)
	{
		const seg = line_seg3.from_line(l, start, end);
		line_seg3.draw(canv, view, seg, style);
	}	
}

class line_seg2
{
	p0;
	p1;

	constructor(p0, p1)
	{
		this.p0 = p0;
		this.p1 = p1;
	}

	static draw(canv, l, style)
	{
		if(style)
		{
			canv.save();
			style.apply(canv);
		}

		canv.beginPath();
		canv.moveTo(l.p0.x, l.p0.y);
		canv.lineTo(l.p1.x, l.p1.y);
		canv.stroke();

		if(style)
		{
			canv.restore();
		}
	}	
}

class line_seg3
{
	p0;
	p1;

	constructor(p0, p1)
	{
		this.p0 = p0;
		this.p1 = p1;
	}

	static from_line(l, start, end)
	{
		const vs = vec3.add(l.p, vec3.scale(l.v, start));
		const ve = vec3.add(l.p, vec3.scale(l.v, end));
		return new line_seg3(vs, ve);
	}

	static project(l, view)
	{
		const p0 = view.project(l.p0);
		const p1 = view.project(l.p1);
		return new line_seg2(p0, p1);
	}

	static draw(canv, view, l, style)
	{
		const proj = line_seg3.project(l, view);
		line_seg2.draw(canv, proj, style);
	}	
}

class arrow2
{
	p0;
	p1;

	constructor(p0, p1)
	{
		this.p0 = p0;
		this.p1 = p1;
	}
	
	static from_line_seg(l)
	{
		this.p0 = l.p0.copy();
		this.p1 = l.p1.copy();
	}

	static draw(canv, arw, style)
	{
		canv.save();
		style.apply(canv);
		canv.beginPath();
		canv.moveTo(arw.p0.x, arw.p0.y);
		canv.lineTo(arw.p1.x, arw.p1.y);
		canv.stroke();

		if(style.arrow_head == "triangle")
		{
			const dv = vec2.normalize(vec2.sub(arw.p1, arw.p0));
			const dv2 = new vec2(dv.y, -dv.x);
			const v0 = arw.p1;
			const v1 = vec2.add(
				vec2.sub(arw.p1, vec2.mul(dv, style.arrow_head_length)),
				vec2.mul(dv2, style.arrow_head_width));
			const v2 = vec2.sub(
				vec2.sub(arw.p1, vec2.mul(dv, style.arrow_head_length)),
				vec2.mul(dv2, style.arrow_head_width));

			canv.lineWidth = 1.0;
			canv.beginPath();
			canv.moveTo(v0.x, v0.y);
			canv.lineTo(v1.x, v1.y);
			canv.lineTo(v2.x, v2.y);
			canv.lineTo(v0.x, v0.y);

			canv.stroke();
			canv.fill();
		}

		else if(style.arrow_head == "dot")
		{
			canv.beginPath();
			canv.arc(arw.p1.x, arw.p1.y, style.arrow_dot_radius, 0.0, Math.PI * 2.0);
			canv.stroke();
			canv.fill();	
		}

		if(style.arrow_tail == "dot")
		{
			canv.beginPath();
			canv.arc(arw.p0.x, arw.p0.y, style.arrow_dot_radius, 0.0, Math.PI * 2.0);
			canv.stroke();
			canv.fill();	
		}

		canv.restore();
	}	
}

class arrow3
{
	p0;
	p1;

	constructor(p0, p1)
	{
		this.p0 = p0;
		this.p1 = p1;
	}
	
	static from_line_seg(l)
	{
		this.p0 = l.p0.copy();
		this.p1 = l.p1.copy();
	}

	static project(view, arw)
	{
		return new arrow2(view.project(arw.p0), view.project(arw.p1));
	}

	static draw(canv, view, arw, style)
	{
		const arw2 = arrow3.project(view, arw);
		arrow2.draw(canv, arw2, style);
	}	
}

class right_triangle2
{
	p;
	v;
	width;
	height;

	constructor(p, v, width, height)
	{
		this.p = p;
		this.v = v;
		this.width = width;
		this.height = height;
	}

	static draw(canv, tri, style)
	{
		canv.save();
		style.apply(canv);	
		canv.beginPath();

		const perp = new vec2(tri.v.y, -tri.v.x);
		const vp = vec2.add(tri.p, vec2.scale(tri.v, tri.width));
		const ve = vec2.add(vp, vec2.scale(perp, -tri.height));
		const v0 = vec2.add(vp, vec2.scale(tri.v, -16.0));
		const v1 = vec2.add(vp, vec2.scale(perp, 16.0));
		const v2 = vec2.add(v0, vec2.scale(perp, 16.0));

		canv.moveTo(tri.p.x, tri.p.y);
		canv.lineTo(vp.x, vp.y);
		canv.lineTo(ve.x, ve.y);
		canv.closePath();
		canv.stroke();

		canv.beginPath();
		canv.moveTo(v0.x, v0.y);
		canv.lineTo(v2.x, v2.y);
		canv.lineTo(v1.x, v1.y);

		canv.stroke();
		canv.restore();
	}
}

class angle2
{
	p;
	start_angle;
	end_angle;

	constructor(p, start_angle, end_angle)
	{
		this.p = p;
		this.start_angle = start_angle;
		this.end_angle = end_angle;
	}

	static from_points(a, b, c)
	{
		const p = b.copy();
		const d = vec2.dot(vec2.normalize(vec2.sub(a, b)), vec2.normalize(vec2.sub(c, b)));
		let a0 = Math.atan2(a.y - b.y, a.x - b.x);
		let a1 = Math.atan2(c.y - b.y, c.x - b.x);

		let ad = Math.acos(d);

		let ang_diff = a1 - a0;
		if(ang_diff < -Math.PI)
		{
			ang_diff += Math.PI * 2.0
		}

		if(ang_diff > Math.PI)
		{
			ang_diff -= Math.PI * 2.0;
		}

		if(ang_diff > 0)
		{
			return new angle2(p, a0, a1);
		}

		return new angle2(p, a1, a0);
	}

	static draw(canv, ang, style)
	{
		canv.save();
		style.apply(canv);

		canv.beginPath();
		canv.arc(ang.p.x, ang.p.y, 32.0, ang.start_angle, ang.end_angle);

		canv.stroke();
		canv.restore();
	}
}

class mat3
{
	row0;
	row1;
	row1;
	
	constructor()
	{
		this.row0 = new vec3(1.0, 0.0, 0.0);
		this.row1 = new vec3(0.0, 1.0, 0.0);
		this.row2 = new vec3(0.0, 0.0, 1.0);
	}

	static from_rows(row0, row1, row2)
	{
		let m = new mat3();
		m.row0 = row0;
		m.row1 = row1;
		m.row2 = row2;
		return m;
	}

	static from_cols(col0, col1, col2)
	{
		let m = new mat3();
		m.row0 = new vec3(col0.x, col1.x, col2.x);
		m.row1 = new vec3(col0.y, col1.y, col2.y);
		m.row2 = new vec3(col0.z, col1.z, col2.z);
		return m;
	}

	static apply(m, v)
	{
		const x = vec3.dot(m.row0, v);
		const y = vec3.dot(m.row1, v);
		const z = vec3.dot(m.row2, v);
		return new vec3(x, y, z);
	}

	static transpose(m)
	{
		return mat3.from_cols(m.row0, m.row1, m.row2);
	}
}

class poly_3
{
	points;

	constructor(points)
	{
		this.points = points;
	}


	// Arcs from v0 to v1 and then offsets by p in segs number of segments
	static arc_between(v0, v1, p, segs)
	{
		let points = [];

		const ang = Math.acos(vec3.dot(v0, v1) / (vec3.length(v0) * vec3.length(v1)));
		const s0 = Math.sin(ang);

		const delta = 1.0 / (segs - 1);
		
		for(let i = 0; i < segs; ++i)
		{
			const t = i * delta;
			const s1 = Math.sin((1.0 - t) * ang);
			const s2 = Math.sin(t * ang);

			points.push(vec3.add(p, vec3.add(vec3.scale(v0, s1 / s0), vec3.scale(v1, s2 / s0))));
		}

		return new poly_3(points);
	}

	static draw(canv, view, poly, style)
	{
		canv.save();
		style.apply(canv);

		canv.beginPath();
		let first = true;
		for(const p of poly.points)
		{
			const p_proj = view.project(p);
			if(first)
			{
				first = false;
				canv.moveTo(p_proj.x, p_proj.y);
			}
			else
			{
				canv.lineTo(p_proj.x, p_proj.y);
			}
		}

		canv.stroke();
		canv.restore();

	}
}

class view_transform
{
	view_mat;
	proj_mat;
	translation;

	constructor(view_mat, translation, proj_mat)
	{
		this.view_mat = view_mat;
		this.translation = translation;
		this.proj_mat = proj_mat;
	}

	project(v)
	{
		const v_pos = vec3.add(mat3.apply(this.view_mat, v), this.translation);
		const p_pos = mat3.apply(this.proj_mat, v_pos);
		return new vec2(p_pos.x, p_pos.y);
	}

	orient(v)
	{
		const v_pos = mat3.apply(this.view_mat, v);
		return v_pos;
	}

	deorient(v)
	{
		const transpose = mat3.transpose(this.view_mat);
		return mat3.apply(transpose, v);
	}
}

class circle_hit_shape
{
	p;
	radius;

	constructor(p, radius)
	{
		this.p = p.copy();
		this.radius = radius;
	}

	has_hit(pos)
	{
		if(vec2.length(vec2.sub(pos, this.p)) < this.radius)
		{
			return true;
		}
	
		return false;
	}

	move_to(pos)
	{
		this.p = pos.copy();
	}

	draw(canv)
	{
		let point_style = new draw_style();
		point_style.fill_style = "rgba(0, 0, 0, 0)";
		point_style.stroke_style = "rgba(100, 200, 255, 0.8)";
		point_style.point_radius = this.radius;
		let point = new point2(this.p);
		point2.draw(canv, point, point_style);
	}
}

class draggable
{
	constructor(on_start, on_end, on_move, hit_shape)
	{
		this.on_start = on_start;
		this.on_end = on_end;
		this.on_move = on_move;
		this.hit_shape = hit_shape;
	}

	has_hit(pos)
	{
		return this.hit_shape.has_hit(pos);
	}

	start_dragging(pos)
	{
		if(!this.on_start)
		{
			return;
		}

		this.on_start(pos);
	}

	stop_dragging(pos)
	{
		if(!this.on_end)
		{
			return;
		}

		this.on_end(pos);
	}

	move(pos)
	{
		if(!this.on_move)
		{
			return;
		}

		this.on_move(pos);
		this.hit_shape.move_to(pos);
	}

	draw(canv)
	{
		if(this.hit_shape.draw)
		{
			this.hit_shape.draw(canv);
		}
	}
}

class drag_controller
{
	active = null;
	hit_obj = null;
	draggables = [];
	mouse_down = false;
	
	constructor(){}
	
	on_mouse_down(mouse_pos)
	{
		if(this.mouse_down)
		{
			return;
		}

		let new_active = null;
		for(let obj of this.draggables)
		{
			if(obj.has_hit(mouse_pos))
			{
				new_active = obj;
				break;
			}
		}

		if(this.active && this.active != new_active)
		{
			this.active.stop_dragging(pos);
		}

		this.active = new_active;

		this.hit_obj = null;

		this.mouse_down = true;
	};

	on_mouse_up(mouse_pos)
	{
		if(this.active)
		{
			this.active.stop_dragging(mouse_pos);
			this.active = null;
		}

		this.mouse_down = false;
	};

	on_mouse_move(mouse_pos)
	{	
		if(this.active)
		{
			this.active.move(mouse_pos);
			return;
		}

		this.hit_obj = null;

		for(let obj of this.draggables)
		{
			if(obj.has_hit(mouse_pos))
			{
				this.hit_obj = obj;
				return;
			}
		}
	}

	draw(canv, show_handles)
	{
		if(show_handles)
		{
			for(let obj of this.draggables)
			{
				if(obj.draw)
				{
					obj.draw(canv);
				}
			}
			
			return;
		}

		if(this.hit_obj && this.hit_obj.draw)
		{
			this.hit_obj.draw(canv);
		}

		if(this.active && this.active.draw)
		{
			this.active.draw(canv);
		}
	}
}

let make_draggable_point = function(control, p)
{
	control.draggables.push(new draggable((pos) =>
	{
	}, (pos) =>
	{
	}, (pos) =>
	{
		p.x = pos.x;
		p.y = pos.y;
	}, new circle_hit_shape(p, 6.0)));
}

class demo_container
{
	drag_control = new drag_controller();

	on_update = [];
	on_draw = [];

	constructor()
	{
	};

	mouse_move(mouse_pos)
	{
		this.drag_control.on_mouse_move(mouse_pos);
	}

	mouse_down(mouse_pos)
	{
		this.drag_control.on_mouse_down(mouse_pos);
	}

	mouse_up(mouse_pos)
	{
		this.drag_control.on_mouse_up(mouse_pos);
	}

	update()
	{
		for(let f of this.on_update)
		{
			f();
		}

	}

	draw(canv, frozen)
	{
		for(let f of this.on_draw)
		{
			f(canv, frozen);
		}

		this.drag_control.draw(canv, !frozen);
	}
}

demo = new demo_container();

c_theta = '\u03B8';

run_demo = function()
{
	const canvas = document.querySelector('#canv');
	const context = canvas.getContext('2d');
	context.imageSmoothingQuality = "high";

	const freeze_check = document.querySelector('#freeze-check');

	let prev_time = 0.0;

	if(demo.mouse_move)
	{
		canvas.addEventListener('mousemove', (e) => 
		{
			if(freeze_check.checked)
			{
				return; 
			}

			const rect = canvas.getBoundingClientRect();
			const mouse_pos = new vec2(e.clientX - rect.left, e.clientY - rect.top);
			demo.mouse_move(mouse_pos);
		});
	}

	if(demo.mouse_down)
	{
		canvas.addEventListener('mousedown', (e) => 
		{
			if(freeze_check.checked)
			{
				return; 
			}

			const rect = canvas.getBoundingClientRect();
			const mouse_pos = new vec2(e.clientX - rect.left, e.clientY - rect.top);
			demo.mouse_down(mouse_pos);
		});
	}

	if(demo.mouse_up)
	{
		canvas.addEventListener('mouseup', (e) => 
		{
			if(freeze_check.checked)
			{
				return; 
			}

			const rect = canvas.getBoundingClientRect();
			const mouse_pos = new vec2(e.clientX - rect.left, e.clientY - rect.top);
			demo.mouse_up(mouse_pos);
		});
	}

	let tick = function(timestamp)
	{
		const delta_time = timestamp - prev_time;	
		let time_left = delta_time;
		const frame_time = 1000.0 / 60.0;
		for(; time_left > frame_time; time_left = time_left - frame_time)
		{
			if(!freeze_check.checked && demo.update)
			{
				demo.update();
			}

			prev_time = timestamp;
		}	

		if(demo.draw)
		{	
			context.clearRect(0, 0, canvas.width, canvas.height);
			demo.draw(context, freeze_check.checked);
		}

		window.requestAnimationFrame(tick);
	}

	window.requestAnimationFrame(tick);

}

window.onload = function()
{
	if(typeof demo !== 'undefined')
	{
		run_demo(demo);
	}

	document.querySelector('#save-button').addEventListener('click', save_image);
}

save_image = function()
{
	const canvas = document.querySelector('#canv');
	const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
	const anchor = document.createElement('a');
	anchor.setAttribute("href", image);
	anchor.setAttribute("download", "image.png");
	anchor.click();
}
