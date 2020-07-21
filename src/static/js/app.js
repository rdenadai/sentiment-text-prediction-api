import { html, Component, render } from '/static/js/preact.standalone.module.js';



class App extends Component {

    render() {
        return html`
            <div>
                <div class="siimple-navbar siimple-navbar--dark siimple-navbar--fluid">
                    <a class="siimple-navbar-title">Sentiment Text Prediction</a>
                </div>
                <div class="siimple-content" style="padding-top: 0px; margin: 0px 10px 0px 10px;">
                    <div class="siimple-grid">
                        <div class="siimple-grid-row">
                            <div class="siimple-grid-col siimple-grid-col--6 siimple-grid-col--sm-12">
                                <${PredictForm} />
                            </div>
                            <div class="siimple-grid-col siimple-grid-col--6 siimple-grid-col--sm-12">
                                abc
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

class PredictForm extends Component {

    constructor() {
        super();
        this.state = {
            phrase: "",
            data: null
        };
    }

    onInput = e => {
        const { value } = e.target;
        this.setState({ phrase: value })
    }

    onSubmit = e => {
        e.preventDefault();

        var this_ = this;

        axios({
            method: "post",
            url: "/classify",
            data: {
                "value": this.state.phrase,
                "classifier": "naive"
            },
        }).then(function (response) {
            if (response.status == 200) {
                this_.setState({ data: response.data });
            }
        });
    }

    render(_, { value }) {
        return html`
            <div class="siimple-card" style="max-width: auto;">
                <div class="siimple-card-body">
                    <div class="siimple-card-title">Avaliar classificador de emoções:</div>
                    <div class="siimple-rule"></div>
                    <div class="siimple-field">
                        <form onSubmit=${this.onSubmit}>
                            <div class="siimple-field">
                                <div class="siimple-field-label">Digite uma frase:</div>
                                <textarea class="siimple-textarea siimple-textarea--fluid" rows="10" onInput=${this.onInput}>${this.phrase}</textarea>
                            </div>
                            <div class="siimple-field">
                                <button type="submit" class="siimple-btn siimple-btn--success">Classificar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            
        `;
    }
}


render(html`<${App} />`, document.getElementById("app"));