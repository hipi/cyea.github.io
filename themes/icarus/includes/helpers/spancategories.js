module.exports = function(hexo) {
  hexo.extend.helper.register("list_span_categories", function(categories) {
    var arr = []
    categories.forEach(item => {
        arr.push(item.name)
    });
    return '<span>'+arr.join('  ')+'</span>'
  });
};
