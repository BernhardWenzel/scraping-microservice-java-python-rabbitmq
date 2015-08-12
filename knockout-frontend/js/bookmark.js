
// The bookmark model
function Bookmark(selfHref, url, created, note, summary) {
    var self = this;
    self.selfHref = selfHref;
    self.url = ko.observable(url);
    self.created = created;
    self.note = ko.observable(note);
    self.summary = summary;
}

// The bookmark view model
function BookmarkViewModel() {
    var self = this;

    self.newUrl = ko.observable();
    self.newNote = ko.observable();
    self.bookmarks = ko.observableArray([]);

    // add bookmark: send POST to bookmarks resource
    self.addBookmark = function () {
        // a little bit of pre-processing of user entered url and note
        var newUrl = self.newUrl();
        if (typeof newUrl == "undefined") {
            alert("Url required");
            return;
        }

        // prefix with http:// if not added by user
        if (newUrl.search(/^http[s]?\:\/\//) == -1) {
            newUrl = 'http://' + newUrl;
        }

        var newNote = self.newNote();
        if (typeof newNote == "undefined") {
            newNote = "";
        }

        // make POST request
        $.ajax("http://localhost:8080/bookmarks", {
            data: '{"url": "' + newUrl + ' ", "note": "' + newNote + '"}',
            type: "post",
            contentType: "application/json",
            success: function (allData) {
                self.loadBookmarks();
                self.newUrl("");
                self.newNote("");
            }
        });
    };

    // update bookmark: send PUT to existing bookmarks resource
    self.updateBookmark = function (bookmark) {

        // same as in "addBookmark" a little bit of parameter checking. Some code duplication here
        // but we leave it for demonstration purposes
        var newUrl = bookmark.url();
        if (typeof newUrl == "undefined") {
            alert("Url required");
            return;
        }

        // prefix with http:// if not added by user
        if (newUrl.search(/^http[s]?\:\/\//) == -1) {
            newUrl = 'http://' + newUrl;
        }

        var newNote = bookmark.note();
        if (typeof newNote == "undefined") {
            newNote = "";
        }

        // make PUT request (or send PATCH then we don't need to include the created date)
        $.ajax(bookmark.selfHref, {
            data: '{"url": "' + newUrl + ' ", "note": "' + newNote + '", "created": "' + bookmark.created +'"}',
            type: "patch",
            contentType: "application/json",
            success: function (allData) {
                self.loadBookmarks();
            }
        });
    };


    // delete bookmark: send DELETE to bookmarks resource
    self.deleteBookmark = function (bookmark) {
        $.ajax(bookmark.selfHref, {
            type: "delete",
            success: function (allData) {
                self.loadBookmarks();
            }
        });
    };

    // load bookmarks from server: GET on bookmarks resource
    self.loadBookmarks = function () {
        $.ajax("http://localhost:8080/bookmarks", {
            type: "get",
            success: function (allData) {
                var json = ko.toJSON(allData);
                var parsed = JSON.parse(json);
                if (parsed._embedded) {
                    var parsedBookmarks = parsed._embedded.bookmarks;
                    var mappedBookmarks = $.map(parsedBookmarks, function (bookmark) {
                        return new Bookmark(bookmark._links.self.href, bookmark.url, bookmark.created, bookmark.note, bookmark.summary)
                    });
                    self.bookmarks(mappedBookmarks);
                } else {
                    self.bookmarks([]);
                }

            }
        });
    };

    // Load initial data
    self.loadBookmarks();
}


// Activates knockout.js
ko.applyBindings(new BookmarkViewModel());