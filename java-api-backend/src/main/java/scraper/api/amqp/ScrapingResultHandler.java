package scraper.api.amqp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import scraper.api.domain.Bookmark;
import scraper.api.domain.BookmarkRepository;

import java.util.List;

@Component
public class ScrapingResultHandler
{
    @Autowired
    private BookmarkRepository bookmarkRepository;

    public void handleMessage(ScrapingResultMessage scrapingResultMessage)
    {
        System.out.println("Received summary: " + scrapingResultMessage.getSummary());
        final String url = scrapingResultMessage.getUrl();
        final List<Bookmark> bookmarks = bookmarkRepository.findByUrl(url);
        if (bookmarks.size() == 0)
        {
            System.out.println("No bookmark of url: " + url + " found.");
        }
        else
        {
            for (Bookmark bookmark : bookmarks)
            {
                bookmark.setSummary(scrapingResultMessage.getSummary());
                bookmarkRepository.save(bookmarks);
                System.out.println("updated bookmark: " + url);
            }
        }
    }
}
