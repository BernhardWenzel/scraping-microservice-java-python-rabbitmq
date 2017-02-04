package scraper.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import scraper.api.domain.BookmarkEventHandler;
import scraper.api.filter.CORSFilter;

@SpringBootApplication
public class ScraperApiApplication
{

    public static void main(String[] args)
    {
        SpringApplication.run(ScraperApiApplication.class, args);
    }

    @Bean
    BookmarkEventHandler bookmarkEventHandler()
    {
        return new BookmarkEventHandler();
    }

    @Bean
    public FilterRegistrationBean commonsRequestLoggingFilter()
    {
        final FilterRegistrationBean registrationBean = new FilterRegistrationBean();
        registrationBean.setFilter(new CORSFilter());
        return registrationBean;
    }
}
