import sys

def make_page(name, source_dir, out_dir):
	template_file = open("template.html")
	text = template_file.read()
	template_file.close()

	script_format = "{d}/{n}.js"

	script_file = open(script_format.format(d = source_dir, n = name))
	script = script_file.read()

	body_format = "{d}/{n}.md"
	body_file = open(body_format.format(d = source_dir, n = name))
	body_text = body_file.read().replace("`", "\\`")

	new_text = text.replace("%SCRIPT%", script).replace("%TEXT%", body_text)

	out_format = "{d}/{n}.html"

	out_file = open(out_format.format(d = out_dir, n = name), "w")
	out_file.write(new_text)
	out_file.close()

source_dir = sys.argv[1]
out_dir = sys.argv[2]

for arg in sys.argv[3:]:
	make_page(arg, source_dir, out_dir)
