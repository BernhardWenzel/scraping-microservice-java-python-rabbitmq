import urllib
from summary import extract

class ScrapingResult:
    def __init__(self):
        self.url = None
        self.summary = None

class Scraper:

    def scrape(self, url):
        url_summary = ""
        try:
            # get html from url
            if not url.startswith("http"):
                url = "http://" + url

            # get summary
            print "Retrieving page summary of %s... " % url

            res = extract(urllib.urlopen(url).read())
            url_summary = "No description found" if res['digest'] is None else res['digest']

        except Exception, e:
            url_summary = "Could not scrape summary. Reason: %s" % e.message

        print "Done: %s = %s" % (url, url_summary)

        # create scraping result
        scraping_result = ScrapingResult()

        scraping_result.summary = url_summary
        scraping_result.url = url

        return scraping_result