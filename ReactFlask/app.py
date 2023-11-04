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
setsCollection= db.sets


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
document = {"name": "hw1", "available": 100, "capacity": 100}
document1 = {"name": "hw2", "available": 100, "capacity": 100}
# setsCollection.insert_one(document)
# setsCollection.insert_one(document1)
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
    project_document = projectCollection.find_one({"name": project})
    sets = project_document["sets"] #amount checked out

    sets_document = setsCollection.find_one({"name": set})
    set_available=sets_document["available"]
    if set == "hw1":
        i = 0
    else:
        i = 1
    # i = sets.index(set)
    curr = project_document["sets"][i]
    new_set = curr - int(amount)
    # cap=document["cap"][i]
    # if(new_avail>cap):
    #     successC={"result":"more than cap", "code":400}

    # else:
    setsCollection.update_one(
        sets_document, {"$set": {"available":int(set_available)+int(amount)}}
    )
    projectCollection.update_one(
        project_document, {"$set": {"sets."+str(i): new_set}}
    )
    successC = {"result": new_set,"available":int(set_available)+int(amount),"setAvailable": int(set_available)+int(amount), "code": 200}
    return jsonify(successC), 200

@app.route('/checkout/<project>/<amount>/<set>')
@cross_origin()
def checkout(project, amount, set):
    project_document = projectCollection.find_one({"name": project})
    sets = project_document["sets"]  # amount checked out

    sets_document = setsCollection.find_one({"name": set})
    set_available = sets_document["available"]
    if ((set_available - int(amount)) < 0):
        returnM = {"message": "error", "code": 404}
        return jsonify(returnM), 200
    if set == "hw1":
        i = 0
    else:
        i = 1
    # i = sets.index(set)
    curr = project_document["sets"][i]
    new_set = curr + int(amount)
    # cap=document["cap"][i]
    # if(new_avail>cap):
    #     successC={"result":"more than cap", "code":400}

    # else:
    setsCollection.update_one(
        sets_document, {"$set": {"available": int(set_available) - int(amount)}}
    )
    projectCollection.update_one(
        project_document, {"$set": {"sets." + str(i): new_set}}
    )
    successC = {"result": new_set, "available": int(set_available) - int(amount),"setAvailable": int(set_available) - int(amount), "code": 200}
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
    hw1_document = setsCollection.find_one({"name":"hw1"})
    hw2_document = setsCollection.find_one({"name": "hw2"})
    available=[hw1_document["available"], hw2_document["available"]]
    cap =[hw1_document["capacity"], hw2_document["capacity"]]
    projects = user_document["projects"]
    print(projects)

    print(info1)
    print(status)

    returnM = {"info": info1,"status":status,"joinedP":projects,"available":available, "cap":cap, "code": 200}
    return jsonify(returnM), 200


@app.route('/projects/<username>/<projectID>')
@cross_origin()
def getInfo(username, projectID):

    project_document=projectCollection.find_one({"name":projectID})
    hw1_document=setsCollection.find_one({"name":"hw1"})
    hw2_document = setsCollection.find_one({"name": "hw2"})
    hw1_available=hw1_document["available"]
    hw1_cap=hw1_document["capacity"]
    hw2_available=hw2_document["available"]
    hw2_cap=hw2_document["capacity"]

    info = {"users": project_document["users"],
            # "sets": project_document["sets"], #amount checked out of each set
            "available": [hw1_available, hw2_available],
            "cap": [hw1_cap, hw2_cap],
            "checked": project_document["sets"],
            "description": project_document["description"]
            }
    print(info)
    returnM = {"info": info, "code": 200}
    return jsonify(returnM), 200

@app.route('/create-project/<id>/<description>/<username>')
@cross_origin()
def create_project(id,description, username):
    # availableWords = []
    project_document = projectCollection.find_one({"name": id})
    if project_document:
        returnM = {"message": "project already exists", "code": 404}
    else:
        userCollection.update_one(
            {'username': username},
            {'$push': {'projects': id}}
        )
        new_document = {"name": id, "users": [username], "sets": [0,0], "description": description}
        projectCollection.insert_one(new_document)
        returnM = {"message": "success", "code": 200}
    return jsonify(returnM), 200

@app.route('/join-project/<id>/<username>')
@cross_origin()
def join_old_project(id, username):
    project_document = projectCollection.find_one({"name": id})
    user_document = userCollection.find_one({"username": username})
    if project_document:
        if user_document and id in user_document.get('projects', []):
            badM = {"message": "Already In Project", "code": 404}
            return jsonify(badM), 200
        else:
            userCollection.update_one(
                {'username': username},
                {'$push': {'projects': id}}
            )
            projectCollection.update_one(
                {'name': id},
                {'$push': {'users': username}}
            )
            badM = {"message": "Successfully Joined", "code": 200}
            return jsonify(badM), 200
    else:
        returnM = {"message": "Project Does Not Exist", "code": 404}
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