const x_basis = vec3.normalize(new vec3(1.0, 0.7, 0.0));
const y_basis_temp = vec3.normalize(new vec3(0.0, 0.8, 1.0));
const z_basis = vec3.normalize(vec3.cross(x_basis, y_basis_temp));
const y_basis = vec3.cross(x_basis, z_basis);

const view = new view_transform(
	mat3.from_rows(x_basis, y_basis, z_basis),
	new vec3(256.0, 256.0, 0.0),
	new mat3());

let p0 = new vec3(-35.0, 5.0, 35.0);
let p1 = new vec3(-15.0, -80.0, -10.0);
let p2 = new vec3(16.0, 28.0, -18.0);
let p3 = new vec3(-40.0, -45.0, -50.0);

let p0_anchor = view.project(p0);
let p1_anchor = view.project(p1);
let p2_anchor = view.project(p2);
let p3_anchor = view.project(p3);

demo.drag_control.draggables.push(new draggable((pos) =>
{
}, (pos) =>
{
}, (pos) =>
{
	const diff = vec2.sub(pos, p0_anchor);
	p0_anchor.x = pos.x;
	p0_anchor.y = pos.y;
	const diff_view = view.deorient(new vec3(diff.x, diff.y, 0.0));
	p0.x += diff_view.x;
	p0.y += diff_view.y;
	p0.z += diff_view.z;
	
}, new circle_hit_shape(p0_anchor, 6.0)));

demo.drag_control.draggables.push(new draggable((pos) =>
{
}, (pos) =>
{
}, (pos) =>
{
	const diff = vec2.sub(pos, p1_anchor);
	p1_anchor.x = pos.x;
	p1_anchor.y = pos.y;
	const diff_view = view.deorient(new vec3(diff.x, diff.y, 0.0));
	p1.x += diff_view.x;
	p1.y += diff_view.y;
	p1.z += diff_view.z;
	
}, new circle_hit_shape(p1_anchor, 6.0)));

demo.drag_control.draggables.push(new draggable((pos) =>
{
}, (pos) =>
{
}, (pos) =>
{
	const diff = vec2.sub(pos, p2_anchor);
	p2_anchor.x = pos.x;
	p2_anchor.y = pos.y;
	const diff_view = view.deorient(new vec3(diff.x, diff.y, 0.0));
	p2.x += diff_view.x;
	p2.y += diff_view.y;
	p2.z += diff_view.z;
	
}, new circle_hit_shape(p2_anchor, 6.0)));

demo.drag_control.draggables.push(new draggable((pos) =>
{
}, (pos) =>
{
}, (pos) =>
{
	const diff = vec2.sub(pos, p3_anchor);
	p3_anchor.x = pos.x;
	p3_anchor.y = pos.y;
	const diff_view = view.deorient(new vec3(diff.x, diff.y, 0.0));
	p3.x += diff_view.x;
	p3.y += diff_view.y;
	p3.z += diff_view.z;
	
}, new circle_hit_shape(p3_anchor, 6.0)));

demo.on_draw.push((c) =>
{
	const v0 = vec3.normalize(vec3.sub(p1, p0));
	const v1 = vec3.normalize(vec3.sub(p3, p2));

	const l0 = new line3(p0, v0);
	const l1 = new line3(p2, v1);

	const udv = vec3.dot(v0, v1);

	let c0 = p0;
	let c1 = p2;

	if(udv != 1.0)
	{
		const qp = vec3.sub(p2, p0);
		const denom = udv * udv - 1.0;
		const t = vec3.dot(qp, vec3.sub(vec3.scale(v1, udv), v0)) / denom;
		const s = vec3.dot(qp, vec3.sub(v1, vec3.scale(v0, udv))) / denom;
		c0 = vec3.add(p0, vec3.scale(v0, t));
		c1 = vec3.add(p2, vec3.scale(v1, s));
	}

	const ls0 = new line_seg3(c0, c1);
	const po0 = new point3(c0);
	const po1 = new point3(c1);

	const arw0 = new arrow3(p0, c0);
	const arw1 = new arrow3(p2, c1);

	let red_style = default_style.copy();
	red_style.stroke_style = '#FF0000';

	let grey_style = default_style.copy();
	grey_style.stroke_style = '#999999';
	grey_style.line_width = 1.0;

	let line_style = default_style.copy();
	line_style.line_width = 1.0;

	const m0 = view.project(vec3.midpoint(p0, p1));
	const m1 = view.project(vec3.midpoint(p0, p2));
	const m2 = view.project(vec3.midpoint(p0, p3));

	const theta_pos = view.project(vec3.add(p0, new vec3(80.0, 80.0, 0.0)));

	line3.draw(c, view, l0, -512.0, 512.0, line_style);
	line3.draw(c, view, l1, -512.0, 512.0, grey_style);
	line_seg3.draw(c, view, ls0, red_style);
	point3.draw(c, view, po0, default_style);
	point3.draw(c, view, po1, default_style);

	arrow3.draw(c, view, arw0, default_style);
	arrow3.draw(c, view, arw1, default_style);

	const p0_proj = view.project(p0);
	const p2_proj = view.project(p2);

	const c0_proj = view.project(c0);
	const c1_proj = view.project(c1);

	c.font = "16px sans-serif";
	c.fillText('p', p0_proj.x - 16.0, p0_proj.y);
	c.fillText('q', p2_proj.x, p2_proj.y + 16.0);

	c.fillText('p + tv', c0_proj.x - 48.0, c0_proj.y);
	c.fillText('q + su', c1_proj.x, c1_proj.y + 16.0);
});

