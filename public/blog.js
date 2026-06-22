(function () {
  var dataEl = document.getElementById("__blog_posts__");
  var grid = document.getElementById("blog-grid");
  var sentinel = document.getElementById("blog-sentinel");
  if (!dataEl || !grid || !sentinel) return;

  var allPosts = JSON.parse(dataEl.textContent);
  var BATCH = 25;
  var EMPTY = [2, 3, 0, 1]; // 0-indexed empty column per row (matches SSR logic)
  var loaded = Math.min(BATCH, allPosts.length);

  function placement(globalIdx) {
    var row = Math.floor(globalIdx / 3);
    var posInRow = globalIdx % 3;
    var emptyCol = EMPTY[row % EMPTY.length];
    var filled = [0, 1, 2, 3].filter(function (c) { return c !== emptyCol; });
    return { gridColumn: filled[posInRow] + 1, gridRow: row + 1 };
  }

  function makeCard(post, globalIdx) {
    var p = placement(globalIdx);
    var a = document.createElement("a");
    a.className = "blog-card";
    a.href = "/blog/" + post.slug;
    a.style.gridColumn = p.gridColumn;
    a.style.gridRow = p.gridRow;

    var imgWrap = document.createElement("div");
    imgWrap.className = "blog-card__image";
    if (post.coverImage) {
      var bg = document.createElement("div");
      bg.className = "blog-card__img";
      bg.style.backgroundImage = "url(" + post.coverImage + ")";
      bg.style.backgroundSize = "cover";
      bg.style.backgroundPosition = "center";
      imgWrap.appendChild(bg);
    } else {
      var ph = document.createElement("div");
      ph.className = "blog-card__img-placeholder " + (post.coverStyle || "");
      imgWrap.appendChild(ph);
    }

    var year = document.createElement("span");
    year.className = "blog-card__year";
    year.textContent = "(" + post.date + ")";

    var title = document.createElement("h2");
    title.className = "blog-card__title";
    title.textContent = post.title;

    a.appendChild(imgWrap);
    a.appendChild(year);
    a.appendChild(title);
    return a;
  }

  function loadNext() {
    if (loaded >= allPosts.length) {
      observer.disconnect();
      sentinel.hidden = true;
      return;
    }
    var end = Math.min(loaded + BATCH, allPosts.length);
    var frag = document.createDocumentFragment();
    for (var i = loaded; i < end; i++) {
      frag.appendChild(makeCard(allPosts[i], i));
    }
    grid.appendChild(frag);
    loaded = end;
    if (loaded >= allPosts.length) {
      observer.disconnect();
      sentinel.hidden = true;
    }
  }

  var observer = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) loadNext();
  }, { rootMargin: "600px" });

  observer.observe(sentinel);
})();
