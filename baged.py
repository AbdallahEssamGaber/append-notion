import turtle
yellow = "yellow"
blue = "blue"
t = turtle.Turtle()
t.penup()
t.goto(-150, 0)
t.pendown()
t.pensize(3)
t.setheading(0)
t.pencolor(blue)
for i in range(8): 
    if i % 2 == 0:
      t.fillcolor(yellow)
     
    t.begin_fill()
    for j in range(4):
        t.forward(40)
        t.left(90)
    t.end_fill()
    t.penup()
    t.forward(80)
    t.pendown()
    t.right(45)
turtle.done()