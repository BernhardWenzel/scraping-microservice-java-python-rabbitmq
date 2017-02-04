from sumy.parsers.html import HtmlParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lex_rank import LexRankSummarizer as Summarizer
from sumy.nlp.stemmers import Stemmer
from sumy.utils import get_stop_words

class ScrapingResult:
    def __init__(self):
        self.url = None
        self.summary = None


LANGUAGE = "english"
SENTENCES_COUNT = 2


class Scraper:

    def scrape(self, url):
        complete_url = url
        try:
            # get summary
            print "Retrieving page summary of %s... " % url

            parser = HtmlParser.from_url(complete_url, Tokenizer(LANGUAGE))
            stemmer = Stemmer(LANGUAGE)

            summarizer = Summarizer(stemmer)
            summarizer.stop_words = get_stop_words(LANGUAGE)

            url_summary = ''.join(str(sentence) for sentence in summarizer(parser.document, SENTENCES_COUNT))

        except Exception, e:
            url_summary = "Could not scrape summary. Reason: %s" % e.message

        print "Done: %s = %s" % (url, url_summary)

        # create scraping result
        scraping_result = ScrapingResult()

        scraping_result.summary = url_summary
        scraping_result.url = url

        return scraping_result
