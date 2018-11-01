$(document).ready(function () {

    let counter = 12;

    $('#load-more').click(function (e) {

        $.ajax({
            type: "POST",
            url: "/explore",
            data: {
                skip: counter
            },
            success: function (data) {
                data.blogs.forEach((blog) => {
                    renderBlog(blog);
                }); 
               counter+= 12;
            },
            error: function (data) {
                $.notify({
                    icon: "nc-icon nc-fav-remove",
                    message: "Something went wrong. Try again"
                }, {
                    type: 'danger',
                    timer: 8000,
                    spacing: 15,
                    placement: {
                        from: 'top',
                        align: 'right'
                    }
                });
            }
        });
    });

    function renderBlog(blog) {
        const newBlogDOM = `<div class="col-xl-3 col-lg-6"><div class="row"><div class="col-2"><i class="fa fa-globe fa-2x mb-1 indigo-text" aria-hidden="true"></i></div><div class="col-10 mb-2 pl-3"><h5 class="feature-title font-bold mb-1">${blog.blog_title}</h5><p class="grey-text mt-2">${blog.blog_slogan}</p><p class="grey-text mt-2"><a href="https://${blog.domain}">${blog.domain}</a></p></div></div></div>`
        const html = $.parseHTML(newBlogDOM);
        $('#blog-list').append(html);
    }
});