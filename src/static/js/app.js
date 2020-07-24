import { html, Component, render } from "/static/js/preact.standalone.module.js";


class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            chars: 0,
            phrase: "",
            emotion: null
        };

        this.onInput = this.onInput.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onInput = e => {
        const { value } = e.target;
        this.setState({ phrase: value })
        this.setState({ chars: value.length })
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

    render(_, { chars, phrase, emotion }) {
        return html`
            <div>
                <div class="siimple-navbar siimple-navbar--dark siimple-navbar--fluid">
                    <a class="siimple-navbar-title">Sentiment Text Prediction</a>
                </div>
                <div class="siimple-content" style="padding-top: 0px; margin: 0px 10px 0px 10px;">
                    <div class="siimple-grid">
                        <div class="siimple-grid-row">
                            <div class="siimple-grid-col siimple-grid-col--7 siimple-grid-col--sm-12">
                                <${PredictForm} phrase=${phrase} chars=${chars} onInput=${this.onInput} onSubmit=${this.onSubmit} />
                            </div>
                            <div class="siimple-grid-col siimple-grid-col--5 siimple-grid-col--sm-12">
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
                                <textarea class="siimple-textarea siimple-textarea--fluid" rows="10" maxLength="512" onInput=${this.props.onInput}>${this.props.phrase}</textarea>
                                <div style="text-align: right;">${this.props.chars} / 512</div>
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

    componentDidMount() {
        var labels = [
            "Alegria", "Surpresa", "Confiança", "Amor", "Otimismo",
            "Desgosto", "Medo", "Raiva", "Tristeza", "Desprezo",
            "Remorso", "Desaprovação", "Temor", "Submissão", "Neutro"
        ];
        var valores = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        var canvas = document.getElementById("emotionGraph")
        this.ctx = canvas.getContext("2d");
        this.chart = new Chart(this.ctx, {
            type: "horizontalBar",
            data: {
                labels: labels,
                datasets: [{
                    label: '%',
                    data: valores,
                    barThickness: 20,
                    backgroundColor: [
                        '#FFEA00DD',
                        '#CDDC39DD',
                        '#33691EDD',
                        '#FFAB00DD',
                        '#F57C00DD',
                        '#E91E63DD',
                        '#9C27B0DD',
                        '#B71C1CDD',
                        '#01579BDD',
                        '#3F51B5DD',
                        '#AA00FFDD',
                        '#F44336DD',
                        '#6200EADD',
                        '#424242DD',
                        '#DDDDDDDD',
                    ],
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }

    componentDidUpdate() {
        if (this.props.emotion) {
            var emotion = this.props.emotion.emotions;
            this.chart.data.datasets[0].data = _.values(emotion);
            this.chart.update();
        }
    }

    render() {
        return html`
            <div class="siimple-card" style="max-width: auto;">
                <div class="siimple-card-body">
                    <div class="siimple-card-title">Resultado:</div>
                    <div class="siimple-rule"></div>
                    <div class="siimple-field">
                        <canvas id="emotionGraph" style="min-height: 300px;"></canvas>
                    </div>
                </div>
            </div>`
    }
}


render(html`<${App} />`, document.getElementById("app"));