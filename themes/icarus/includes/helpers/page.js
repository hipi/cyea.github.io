/**
 * Helper functions for page/post.
 *
 * @example
 *     <%- is_categories(page) %>
 *     <%- is_tags(page) %>
 *     <%- page_title(page) %>
 *     <%- meta(post) %>
 *     <%- has_cover(post) %>
 *     <%- get_cover(post) %>
 *     <%- get_og_image(post) %>
 */
module.exports = function(hexo) {
  function trim(str) {
    return str
      .trim()
      .replace(/^"(.*)"$/, "$1")
      .replace(/^'(.*)'$/, "$1");
  }

  function split(str, sep) {
    var result = [];
    var matched = null;
    while ((matched = sep.exec(str))) {
      result.push(matched[0]);
    }
    return result;
  }

  hexo.extend.helper.register("is_categories", function(page = null) {
    return (page === null ? this.page : page).__categories;
  });

  hexo.extend.helper.register("is_tags", function(page = null) {
    return (page === null ? this.page : page).__tags;
  });

  /**
   * Generate html head title based on page type
   */
  hexo.extend.helper.register("page_title", function(page = null) {
    page = page === null ? this.page : page;
    let title = page.title;

    if (this.is_archive()) {
      title = this._p("common.archive", Infinity);
      if (this.is_month()) {
        title += ": " + page.year + "/" + page.month;
      } else if (this.is_year()) {
        title += ": " + page.year;
      }
    } else if (this.is_category()) {
      title = this._p("common.category", 1) + ": " + page.category;
    } else if (this.is_tag()) {
      title = this._p("common.tag", 1) + ": " + page.tag;
    } else if (this.is_categories()) {
      title = this._p("common.category", Infinity);
    } else if (this.is_tags()) {
      title = this._p("common.tag", Infinity);
    }

    const siteTitle = hexo.extend.helper.get("get_config").bind(this)(
      "title",
      "",
      true
    );
    return [title, siteTitle]
      .filter(str => typeof str !== "undefined" && str.trim() !== "")
      .join(" - ");
  });

  hexo.extend.helper.register("meta", function(post) {
    var metas = post.meta || [];
    var output = "";
    var metaDOMArray = metas.map(function(meta) {
      var entities = split(meta, /(?:[^\\;]+|\\.)+/g);
      var entityArray = entities
        .map(function(entity) {
          var keyValue = split(entity, /(?:[^\\=]+|\\.)+/g);
          if (keyValue.length < 2) {
            return null;
          }
          var key = trim(keyValue[0]);
          var value = trim(keyValue[1]);
          return key + '="' + value + '"';
        })
        .filter(function(entity) {
          return entity;
        });
      return "<meta " + entityArray.join(" ") + " />";
    });
    return metaDOMArray.join("\n");
  });

  hexo.extend.helper.register("has_cover", function(post) {
    const getConfig = hexo.extend.helper.get("get_config").bind(this);
    const allowCover = getConfig("article.cover", true);
    return allowCover
    // if (!allowCover) {
    //   return false;
    // }
    // return post.hasOwnProperty("cover") && post.cover;
  });

  hexo.extend.helper.register("get_cover", function(post) {
    const getConfig = hexo.extend.helper.get("get_config").bind(this);
    var coverauto_enable = getConfig("article.coverauto.enable", true);
    var coverauto_url = getConfig("article.coverauto.url", true);
    const hasCover = hexo.extend.helper.get("has_cover").bind(this)(
      post
    );
    if (!hasCover) {
      return false;
    }
    var url = post.cover || "";
    if (!url) {
      var imgPattern = /\<img\s.*?\s?src\s*=\s*['|"]?([^\s'"]+).*?\>/gi;
      var result = imgPattern.exec(post.content);
      if (result && result.length > 1) {
        url = result[1];
      }
    }
    
    // if (!url && coverauto_enable) {
    //   url = coverauto_url;
    // }

    return url;
    // const hasCover = hexo.extend.helper.get('has_cover').bind(this)(post);
    // return this.url_for(hasCover ? post.cover : "images/cover.svg");
  });

  hexo.extend.helper.register("has_og_image", function(post) {
    return post.hasOwnProperty("og_image");
  });

  hexo.extend.helper.register("get_og_image", function(post) {
    const getConfig = hexo.extend.helper.get("get_config").bind(this);
    const hasConfig = hexo.extend.helper.get("has_config").bind(this);

    const hasOGImage = hexo.extend.helper.get("has_og_image").bind(this)(post);
    const hasCover = hexo.extend.helper.get("has_cover").bind(this)(
      post
    );

    const getCover = hexo.extend.helper.get("get_cover").bind(this);

    let og_image;

    if (hasOGImage) og_image = post.og_image;
    else if (hasCover) og_image = getCover(post);
    else og_image = getConfig("article.og_image", "/images/og_image.png");

    return this.url_for(og_image);
  });
};
