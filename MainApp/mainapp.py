from flask import Flask, jsonify, render_template
import requests

app = Flask(__name__)


# postingan
def get_posting(posting_id):
    response = requests.get(f'http://localhost:5000/posting/{posting_id}')
    return response.json()

#get user
def get_user(posting_id):
    response = requests.get(f'http://localhost:5002/user/{posting_id}')
    return response.json()['email']

#get artiekl
def get_article(posting_id):
    response = requests.get(f'http://localhost:5003/article/{posting_id}')
    return response.json()['post']

@app.route('/posting/<int:posting_id>')
def get_posting_info(posting_id):
    
    #posting
    posting_info = get_posting(posting_id)
    #user
    user_info = get_user(posting_id)
    #article
    article_contain = get_article(posting_id)

    return render_template('index.html', posting=posting_info, user=user_info, post=article_contain)

if __name__ == "__main__":
    app.run(debug=True, port=5004)