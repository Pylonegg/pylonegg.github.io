import json
import random
import os

# Multiple Choice Quiz Script
def ask_question(question_data):
    print(question_data["question"], "\n")
    for choice in question_data["choices"]:
        print(choice)
    
    # Get the user's answer
    while True:
        answer = input("\nAnswer: ").upper()
        if answer in ['A', 'B', 'C', 'D']:
            break
        else:
            print("Invalid input. Please enter A, B, C, or D.")
    
    # Convert the letter to the index
    answer_index = ord(answer) - ord('A')
    
    # Check if the answer is correct
    if answer_index == question_data["correct"]:
        print("Correct!\n")
        return True
    else:
        print(f"Wrong! The correct answer is {question_data['choices'][question_data['correct']]}\n")
        return False


def run_quiz():
    # load questions
    os.system('clear')
    file = open("learn/az104.json").read()
    questions = json.loads(file)

    # get categories
    categories = []
    for q in questions:
        categories.append(q.get('category'))
    categories = ['All'] + list(set(categories))

    # pick category
    print("\nPlease select a category:\n")
    for index, category in enumerate(categories):
        print(f"{index}. {category}")
    selected_category = input("\nSelect a Category: ")
    category = categories[int(selected_category)]

    if category != "All":
        questions =  [q for q in questions if q.get('category') == category]
    
    limit = 1
    count = 0
    score = 0

    while count < limit:
        os.system('clear')
        count +=1
        print(f"Question {count} of {limit} | Category: {category} | Category Size: {len(questions)}\n")
        index = random.choice(range(0, len(questions)))
        if ask_question(questions[index]):
            score += 1

    os.system('clear')
    print(f"Quiz complete!\n\nYou scored {score} out of {limit} ({int(((score/limit)*100))}%).\n")



# Start the quiz
if __name__ == "__main__":
    run_quiz()