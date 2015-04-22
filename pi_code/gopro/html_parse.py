from HTMLParser import HTMLParser
import sys

# create a subclass and override the handler methods
class MyHTMLParser(HTMLParser):
    def handle_starttag(self, tag, attrs):
      if tag == "a":
    	for attr in attrs:
    	   if attr[0] == 'href':
             print attr[1]

# instantiate the parser and fed it some HTML
def main(argv):
 inputF = open(argv, "r")
 inputH = inputF.read().replace('\n', '')
 parser = MyHTMLParser()
 parser.feed(inputH)

if __name__ == '__main__':
  main(sys.argv[1])