import cohere
from cohere.responses.classify import Example
co = cohere.Client('8GEb0w8gJW7TnKs6FLR45yWG0KSLIJNpeuIikuVF')

text=("Look, I was gonna go easy on you not to hurt your feelings But I'm only going to get this one chance (six minutes-, six minutes-)Something's wrong, I can feel it (six minutes, Slim Shady, you're on!)Just a feeling I've got, like something's about to happen, but I don't know whatIf that means what I think it means, we're in trouble, big trouble")

response1 = co.summarize(
    text=text,
)

print(response1)

examples=[
  Example("Greece", "City"),
  Example("Toronto", "City"),
  Example("BeiJing", "City"),
  Example("Rome", "City"),
  Example("Norman", "Not City"),
  Example("Peter", "Not City"),
]

inputs=[
  "Shanghai",
  "Jacob",
]

response2 = co.classify(
  inputs=inputs,
  examples=examples,
)
print(response2)