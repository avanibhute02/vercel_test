import os

from flask import Flask, jsonify
from flask_cors import cross_origin, CORS

app = Flask(__name__, static_folder='./build', static_url_path='/')
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


users  = {
    "sophia":"harder",
    "sah":"patches",
}

#to add a new user: user[new _username] = new_password


# @app.route('/getLastName/<firstName>')
# @cross_origin()
# def hello_world(firstName):
#     if firstName == "Abay":
#         successM = {"name": "Samant", "code": 200}
#         return jsonify(successM), 200
#     else:
#         errorM = {"error": "User Not Found", "code": 404}
#         return jsonify(errorM), 404


@app.route('/getPassword/<username>')
@cross_origin()
def hello_world(username):
    words = username.split()

    if words[0] in users:
        if words[1] == users[words[0]]:
            successM = {"password": "signed in", "code": 200}
            return jsonify(successM), 200
        else:
            errorM = {"error": "Wrong password", "code": 404}
            return jsonify(errorM), 404
    else:
        errorM = {"error": "User Not Found", "code": 404}
        return jsonify(errorM), 404

@app.route('/signup/<username>')
@cross_origin()
def new_user(username):
    words = username.split()
    if words[0] in users:
        errorM = {"error": "User already exists", "code": 404}
        return jsonify(errorM), 404
    else :
        users[words[0]] = words[1]
        successM = {"result": "new user created", "code": 200}
        return jsonify(successM), 200





@app.route('/')
@cross_origin()
def index():
    return app.send_static_file('index.html')


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False, port=5000)
