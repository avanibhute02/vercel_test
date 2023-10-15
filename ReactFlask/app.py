import os

from flask import Flask, jsonify
from flask_cors import cross_origin, CORS
import pymongo
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
uri = "mongodb+srv://sophiaharder:Patches!2017@cluster0.hsoqdrb.mongodb.net/?retryWrites=true&w=majority"
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db = client.Cluster0
userCollection = db.hardwareUser

if userCollection.find_one({"username":{"$eq":"sophia"}}):
    print("user already exists")
else:
    document = {"username": "sophia", "password":"harder"}
    userCollection.insert_one(document)


app = Flask(__name__, static_folder='./build', static_url_path='/')
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

#
# users  = {
#     "sophia":"harder",
#     "sah":"patches",
# }

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
    user_document = userCollection.find_one({"username": words[0]})
    if user_document:
        if words[1] == user_document["password"]:
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
    user_document = userCollection.find_one({"username": words[0]})
    if user_document:
        errorM = {"error": "User already exists", "code": 404}
        return jsonify(errorM), 404
    else :
        document = {"username": words[0], "password": words[1]}
        userCollection.insert_one(document)
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
