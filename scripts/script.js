const app = new Vue({
    el: '#app',
    data: {
        token: "",
        counter: 0,
        results: {},
        total: false
    },
    methods: {
        update: function() {
            app.counter = 0;
            const options = {
                method: "GET",
                headers: {
                    "Accept": "application/vnd.github.mister-fantastic-preview+json",
                    "Authorization": "token " + app.token
                }
            };
            fetch("https://api.github.com/user/repos?affiliation=owner", options).then(response => {
                return response.json();
            }).then(data => {
                app.results = {};
                app.total = data.length;
                data.forEach(repo => {
                    app.results[repo.name] = {
                        private: repo.private,
                        url: repo.html_url,
                        name: repo.name,
                        branches: [],
                        pages: false
                    };
                    fetch(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/branches`, options).then(response => {
                        return response.json();
                    }).then(data => {
                        app.counter++;
                        data.forEach(branch => {
                            app.results[repo.name].branches.push(branch.name);
                        });
                    });
                    fetch(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/pages`, options).then(response => {
                        return response.json();
                    }).then(data => {
                        app.counter++;
                        if (data.source) app.results[repo.name].pages = data.source.branch;
                    });
                });
            });
        }
    }
});