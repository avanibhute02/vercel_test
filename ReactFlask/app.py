import os

from flask import Flask, jsonify
from flask_cors import cross_origin, CORS
import pymongo
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
uri = "mongodb+srv://group2:swelab@cluster0.hsoqdrb.mongodb.net/?retryWrites=true&w=majority"
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
projectCollection= db.projects


hwAvail={
    "hw1":50,
    "hw2":0
}
hwCap={
    "hw1":100,
    "hw2":100
}
HWSet1={
    "users": ["sophia", "steve"],
    "sets":["hw1", "hw2"],
    "available": hwAvail,
    "capacity": hwCap


}
document = {"name": "1", "users": ["sophia", "avani"], "sets": ["hw1", "hw2"], "available":[50, 20], "cap":[100,50]}
# projectCollection.insert_one(document)
# projectCollection.insert_one(document)



# if userCollection.find_one({"username":{"$eq":"sophia"}}):
#     print("user already exists")
# else:
#     document = {"username": "sophia", "password":"harder"}
#     userCollection.insert_one(document)


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

@app.route('/join/<username>/<projectID>')
@cross_origin()
def join_project(username, projectID):
    user_document = userCollection.find_one({"username": username})

    if user_document and projectID in user_document.get('projects',[]):
        errorM = {"result": "Already Joined", "code": 200}
        print(errorM)
        return jsonify(errorM), 404
    else :
        userCollection.update_one(
            {'username': username},
            {'$push': {'projects': projectID}}
        )
        successM = {"result": "Joined", "code": 200}
        print(successM)
        return jsonify(successM), 200

@app.route('/leave/<username>/<projectID>')
@cross_origin()
def leave_project(username, projectID):
    user_document = userCollection.find_one({"username": username})

    if user_document and projectID in user_document.get('projects',[]):
        userCollection.update_one(
            {'username': username},
            {'$pull': {'projects': projectID}}
        )
        successM = {"result": "Left", "code": 200}
        print(successM)
        return jsonify(successM), 200
    else :
        errorM = {"result": "Not part of project", "code": 200}
        print(errorM)
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
        document = {"username": words[0], "password": words[1], "projects":[]}
        userCollection.insert_one(document)
        successM = {"result": "new user created", "code": 200}
        return jsonify(successM), 200

@app.route('/checkin/<project>/<amount>/<set>')
@cross_origin()
def checkin(project, amount, set):
    document = projectCollection.find_one({"name": project})
    sets = document["sets"]
    i = sets.index(set)
    curr = document["available"][i]
    new_avail = curr + int(amount)

    projectCollection.update_one(
        document,
        {"$set": {"available."+str(i): new_avail}}
    )
    successC = {"result": new_avail, "code": 200}
    return jsonify(successC), 200

@app.route('/checkout/<project>/<amount>/<set>')
@cross_origin()
def checkout(project, amount, set):
    document=projectCollection.find_one({"name":project})
    sets = document["sets"]
    i = sets.index(set)
    curr=document["available"][i]
    new_avail=curr-int(amount)


    projectCollection.update_one(
        document,
        {"$set": {"available."+str(i):new_avail}}
    )
    print("available."+str(i))
    print(new_avail)
    successC = {"result": new_avail, "code": 200}
    return jsonify(successC), 200


info1={

        "name":"",
        "users": ["avani"],
        "sets": ["hw1"],
        "available": [0],
        "cap": [50]
}
@app.route('/setup/<username>')
@cross_origin()
def setup(username):
    if username in info1["users"]:
        status = True

    else:
        status = False
    # documents = projectCollection.find
    # info1["name"]=document[]
    user_document = userCollection.find_one({"username": username})
    projects = user_document["projects"]
    print(projects)

    print(info1)
    print(status)

    returnM = {"info": info1,"status":status,"joinedP":projects,"code": 200}
    return jsonify(returnM), 200


@app.route('/projects/<username>/<projectID>')
@cross_origin()
def getInfo(username, projectID):

    project_document=projectCollection.find_one({"name":projectID})
    info = {"users": project_document["users"],
            "sets": project_document["sets"],
            "available": project_document["available"],
            "cap": project_document["cap"]}
    print(info)
    returnM = {"info": info, "code": 200}
    return jsonify(returnM), 200





@app.route('/')
@cross_origin()
def index():
    return app.send_static_file('index.html')


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False, port=5000)