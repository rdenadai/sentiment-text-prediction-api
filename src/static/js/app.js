import { html, Component, render } from '/static/js/preact.standalone.module.js';



class App extends Component {

    state = {

    };

    componentDidMount() {

    }

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

    componentDidMount() {
    }

    render() {
        return html`
            <div class="siimple-card" style="max-width: auto;">
                <div class="siimple-card-body">
                    <div class="siimple-card-title">Avaliar classificador de emoções:</div>
                    <div class="siimple-rule"></div>
                    <div class="siimple-field">
                        <div class="siimple-field">
                            <div class="siimple-field-label">Digite uma frase:</div>
                            <textarea class="siimple-textarea siimple-textarea--fluid" rows="10"></textarea>
                        </div>
                        <div class="siimple-field">
                            <span class="siimple-btn siimple-btn--success">Classificar</span>
                        </div>
                    </div>
                </div>
            </div>
            
        `;
    }
}


render(html`<${App} />`, document.getElementById("app"));