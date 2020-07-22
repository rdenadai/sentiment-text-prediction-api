import { html, Component, render } from '/static/js/preact.standalone.module.js';



class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            phrase: "",
            emotion: null
        };

        this.onInput = this.onInput.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onInput = e => {
        const { value } = e.target;
        this.setState({ phrase: value })
    }

    onSubmit = e => {
        e.preventDefault();

        axios({
            method: "post",
            url: "/classify",
            data: {
                "value": this.state.phrase,
                "classifier": "naive"
            },
        }).then((response) => {
            if (response.status == 200) {
                this.setState({ emotion: response.data });
            }
        });
    }

    render(_, { phrase, emotion }) {
        return html`
            <div>
                <div class="siimple-navbar siimple-navbar--dark siimple-navbar--fluid">
                    <a class="siimple-navbar-title">Sentiment Text Prediction</a>
                </div>
                <div class="siimple-content" style="padding-top: 0px; margin: 0px 10px 0px 10px;">
                    <div class="siimple-grid">
                        <div class="siimple-grid-row">
                            <div class="siimple-grid-col siimple-grid-col--6 siimple-grid-col--sm-12">
                                <${PredictForm} phrase=${phrase} onInput=${this.onInput} onSubmit=${this.onSubmit} />
                            </div>
                            <div class="siimple-grid-col siimple-grid-col--6 siimple-grid-col--sm-12">
                                <${EmotionPresenter} emotion=${emotion} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

class PredictForm extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return html`
            <div class="siimple-card" style="max-width: auto;">
                <div class="siimple-card-body">
                    <div class="siimple-card-title">Avaliar classificador de emoções:</div>
                    <div class="siimple-rule"></div>
                    <div class="siimple-field">
                        <form onSubmit=${this.props.onSubmit}>
                            <div class="siimple-field">
                                <div class="siimple-field-label">Digite uma frase:</div>
                                <textarea class="siimple-textarea siimple-textarea--fluid" rows="10" onInput=${this.props.onInput}>${this.props.phrase}</textarea>
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

class EmotionPresenter extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        // var sintax = "";
        // if (this.props.emotion) {
        //     sintax = JSON.stringify(this.props.emotion.sintax, undefined, 4);
        // }
        // return html`
        //     <pre>
        //         ${sintax}
        //     </pre>
        // `;

        if (this.props.emotion) {
            var emotion = this.props.emotion.emotions;
            return html`
                <div class="siimple-table">
                    <div class="siimple-table-header">
                        <div class="siimple-table-row">
                            <div class="siimple-table-cell">Emoção</div>
                            <div class="siimple-table-cell">%</div>
                        </div>
                    </div>
                    <div class="siimple-table-body">
                        <div class="siimple-table-row">
                            <div class="siimple-table-cell">Alegria</div>
                            <div class="siimple-table-cell">${emotion["alegria"]}</div>
                        </div>
                        <div class="siimple-table-row">
                            <div class="siimple-table-cell">Surpresa</div>
                            <div class="siimple-table-cell">${emotion["surpresa"]}</div>
                        </div>
                        <div class="siimple-table-row">
                            <div class="siimple-table-cell">Confiança</div>
                            <div class="siimple-table-cell">${emotion["confiança"]}</div>
                        </div>
                        <div class="siimple-table-row">
                            <div class="siimple-table-cell">Amor</div>
                            <div class="siimple-table-cell">${emotion["amor"]}</div>
                        </div>
                        <div class="siimple-table-row">
                            <div class="siimple-table-cell">Desgosto</div>
                            <div class="siimple-table-cell">${emotion["desgosto"]}</div>
                        </div>
                        <div class="siimple-table-row">
                            <div class="siimple-table-cell">Medo</div>
                            <div class="siimple-table-cell">${emotion["medo"]}</div>
                        </div>
                        <div class="siimple-table-row">
                            <div class="siimple-table-cell">Raiva</div>
                            <div class="siimple-table-cell">${emotion["raiva"]}</div>
                        </div>
                        <div class="siimple-table-row">
                            <div class="siimple-table-cell">Tristeza</div>
                            <div class="siimple-table-cell">${emotion["tristeza"]}</div>
                        </div>
                        <div class="siimple-table-row">
                            <div class="siimple-table-cell">Desprezo</div>
                            <div class="siimple-table-cell">${emotion["desprezo"]}</div>
                        </div>
                        <div class="siimple-table-row">
                            <div class="siimple-table-cell">Remorso</div>
                            <div class="siimple-table-cell">${emotion["remorso"]}</div>
                        </div>
                        <div class="siimple-table-row">
                            <div class="siimple-table-cell">Desaprovação</div>
                            <div class="siimple-table-cell">${emotion["desaprovação"]}</div>
                        </div>
                        <div class="siimple-table-row">
                            <div class="siimple-table-cell">Temor</div>
                            <div class="siimple-table-cell">${emotion["temor"]}</div>
                        </div>
                        <div class="siimple-table-row">
                            <div class="siimple-table-cell">Submissão</div>
                            <div class="siimple-table-cell">${emotion["submissão"]}</div>
                        </div>
                    </div>
                </div>
            `;
        }
        return html``
    }
}


render(html`<${App} />`, document.getElementById("app"));