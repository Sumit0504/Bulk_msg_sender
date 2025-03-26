from flask import Flask, render_template, request
import pandas as pd
import time
import random
import logging
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

driver = None
logging.basicConfig(filename="failed_messages.log", level=logging.ERROR, 
                    format="%(asctime)s - Failed to send message to %(message)s", datefmt="%Y-%m-%d %H:%M:%S")

def start_driver():
    global driver
    if driver is None:
        print("Opening Chrome... Please scan the QR code.")
        driver = webdriver.Chrome()
        driver.get("https://web.whatsapp.com/")
        return "Chrome opened. Please log in."
    return "Chrome is already running."

def send_message(phone, message):
    try:
        url = f"https://web.whatsapp.com/send?phone={phone}&text={message}"
        driver.get(url)
        time.sleep(random.randint(8, 12))
        
        send_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(@aria-label, 'Send')]"))
        )
        send_button.click()
        
        print(f"✅ Message sent to {phone}")
        time.sleep(random.randint(12, 16))  # Delay between messages
    except Exception as e:
        print(f"❌ Failed to send message to {phone}: {e}")
        logging.error(f"{phone} - {e}")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/start_whatsapp", methods=["POST"])
def start_whatsapp():
    message = start_driver()
    return message

@app.route("/send_messages", methods=["POST"])
def send_messages():
    global driver
    if driver is None:
        return "Please start WhatsApp first!"
    
    file = request.files["file"]
    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(filepath)

        contacts = pd.read_excel(filepath)

        for index, row in contacts.iterrows():
            send_message(str(row["Phone"]), str(row["Message"]))

        return "Messages Sent! Check the console for details."
    return "No file uploaded."

if __name__ == "__main__":
    app.run(debug=True)
