from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def menu():
    return render_template("menu.html")


@app.route("/page/orange")
def page_orange():
    return page(
        button_id="orange",
        title="Orange",
        text="More text here",
        color="#d95f02"
    )


@app.route("/page/blue")
def page_blue():
    return page(
        button_id="blue",
        title="Blue",
        text="More text here",
        color="#2563eb"
    )


@app.route("/page/purple")
def page_purple():
    return page(
        button_id="purple",
        title="Purple",
        text="More text here",
        color="#7c3aed"
    )


def page(button_id, title, text, color):
    return render_template(
        "page.html",
        button_id=button_id,
        title=title,
        text=text,
        color=color
    )


if __name__ == "__main__":
    app.run(debug=True)
