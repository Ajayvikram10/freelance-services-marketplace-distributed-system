import     React, {Component}       from 'react';
import      { connect }             from 'react-redux';
import      ReactHighcharts         from 'react-highcharts';
import       NavBar                 from '../../helper/navbar';
import { transactionWebService }    from "../../services/transaction.services";
import Alert from "react-s-alert";
import Modal                from 'react-responsive-modal';
import '../../stylesheet/transaction.css';

class TransactionsPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            incoming: 100,
            outgoing: 100,
            Add_Money: false,
            Withdraw_Money: false,
            my_transaction_details_status: false,
            my_transaction_details: [],
            my_transaction_details_master: [],
            openAddModal: false,
            openWithdrawModal: false
        };
    }


    componentWillMount() {

        const user  = this.props.userDetails.user;

        transactionWebService.fetchTransactionDetailsWS()
            .then(
                response => {
                    console.log(response.data.transactionDetails.length);
                    if (response.data.transactionDetails.length > 0)
                        this.setState({my_transaction_details_status: true});
                    this.setState({my_transaction_details: response.data.transactionDetails});
                    this.setState({my_transaction_details_master: response.data.transactionDetails});

                    console.log("this.state.getMyTransactionDetails");
                    console.log(this.state.my_transaction_details_master);

                    let incoming=0,outgoing=0;

                    for (let i = 0; i < response.data.transactionDetails.length; i++) {
                        if (response.data.transactionDetails[i].type === "Add") {
                            incoming+=response.data.transactionDetails[i].amount;
                        }
                        else  if (response.data.transactionDetails[i].type === "Withdraw") {
                            outgoing+=response.data.transactionDetails[i].amount;
                        }
                        else if (response.data.transactionDetails[i].type === "Transfer" && response.data.transactionDetails[i].from === user.username) {
                            outgoing+=response.data.transactionDetails[i].amount;
                        }
                        else if (response.data.transactionDetails[i].type === "Transfer" && response.data.transactionDetails[i].to === user.username) {
                            incoming+=response.data.transactionDetails[i].amount;
                        }
                    }
                    this.setState({incoming:incoming});
                    this.setState({outgoing:outgoing});
                },
                error => {
                    console.log("Error!");
                    console.log(error);
                }
            );
    }

    handleAddMoney = (event) => {

        const user  = this.props.userDetails.user;
        event.preventDefault();

        const Transaction = {
            from: user.username,
            to: user.username,
            type: "Add",
            amount: this.refs.Add.value,
            project: '',
        };

        transactionWebService.makeTransactionWS(Transaction).then(
            response => {
                this.refs.Add.value = "";
                this.refs.Card.value = "";
                this.refs.CVV.value = "";
                Alert.info(response.data.message, {
                    effect: 'jelly',
                    timeout: 1500,
                    offset: 50
                });
                this.setState({Add_Money: false});

                transactionWebService.fetchTransactionDetailsWS().then(
                    response => {
                        console.log(response.data.transactionDetails.length);
                        if (response.data.transactionDetails.length > 0)
                            this.setState({my_transaction_details_status: true});
                        this.setState({my_transaction_details: response.data.transactionDetails});
                        this.setState({my_transaction_details_master: response.data.transactionDetails});

                        console.log("this.state.getMyTransactionDetails");
                        console.log(this.state.my_transaction_details_master);

                        let incoming = 0, outgoing = 0;

                        for (let i = 0; i < response.data.transactionDetails.length; i++) {
                            if (response.data.transactionDetails[i].type === "Add") {
                                incoming += response.data.transactionDetails[i].amount;
                            }
                            else if (response.data.transactionDetails[i].type === "Withdraw") {
                                outgoing += response.data.transactionDetails[i].amount;
                            }
                        }
                        this.setState({incoming: incoming});
                        this.setState({outgoing: outgoing});
                    },
                    error => {
                        console.log("Error!");
                        console.log(error);
                    }
                );
            },
            error => {

            }
        );
    }

    handleWithdrawMoney = (event) => {

        const user  = this.props.userDetails.user;
        event.preventDefault();

        const Transaction = {
            from: user.username,
            to: user.username,
            type: "Withdraw",
            amount: this.refs.Withdraw.value,
            project: '',
        };

        transactionWebService.makeTransactionWS(Transaction)
            .then(
                response => {
                    this.refs.Withdraw.value = "";
                    this.refs.Account.value = "";
                    Alert.info(response.data.message, {
                        effect: 'jelly',
                        timeout: 3000,
                        offset: 50
                    });
                    this.setState({Withdraw_Money: false,});

                    transactionWebService.fetchTransactionDetailsWS()
                        .then(
                            response => {
                                console.log(response.data.transactionDetails.length);
                                if (response.data.transactionDetails.length > 0)
                                    this.setState({my_transaction_details_status: true});
                                this.setState({my_transaction_details: response.data.transactionDetails});
                                this.setState({my_transaction_details_master: response.data.transactionDetails});

                                console.log("this.state.getMyTransactionDetails");
                                console.log(this.state.my_transaction_details_master);

                                let incoming = 0, outgoing = 0;

                                for (let i = 0; i < response.data.transactionDetails.length; i++) {
                                    if (response.data.transactionDetails[i].type === "Add") {
                                        incoming += response.data.transactionDetails[i].amount;
                                    }
                                    else if (response.data.transactionDetails[i].type === "Withdraw") {
                                        outgoing += response.data.transactionDetails[i].amount;
                                    }
                                }
                                this.setState({incoming: incoming});
                                this.setState({outgoing: outgoing});
                            },
                            error => {
                                console.log("Error!");
                                console.log(error);
                            }
                        );
                },
                error => {

                }
            );
    };
    onOpenAddModal = () => { this.setState({ openAddModal: true, Add_Money: !this.state.Add_Money }); };
    onCloseAddModal = () => { this.setState({ openAddModal: false }); };

    onOpenWithdrawModal = () => { this.setState({ openWithdrawModal: true, Withdraw_Money: !this.state.Withdraw_Money }); };
    onCloseWithdrawModal = () => { this.setState({ openWithdrawModal: false }); };

    render() {
        const config = {
            colors: ['#90ED7D', '#7cb5ec'],
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'In-flow/Out-flow Transactions'
            },
            tooltip: {
                pointFormat: ' <b>{point.percentage:.1f} %</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.y:.1f}$',
                    },
                    showInLegend: true
                }
            },
            series: [{
                name: 'Total',
                colorByPoint: true,
                data: [{
                    name: 'In-flow',
                    y: this.state.incoming,
                    sliced: true,
                    selected: true
                }, {
                    name: 'Out-flow',
                    y: this.state.outgoing,
                }]
            }],
            credits: {
                enabled: false
            },

        };

        const user  = this.props.userDetails.user;
        return (
            <div>
                <NavBar currentPage={"transaction"}/>
                <div className="main-content">
                    <div>
                        <div className="mt-4 col-sm-7 col-sm-offset-1">
                            <div className="col-md-12 col-md-offset-0">
                                <div className="panel panel-primary" id="shadowPanel-bid">
                                    <ReactHighcharts config={config} ref="chart"></ReactHighcharts>
                                    <div style={{marginLeft: 40, marginBottom: 40}} className='text-center'>
                                        <button className="btn btn-primary mb-2"  onClick={this.onOpenAddModal}>
                                            Add Money
                                        </button>

                                        <button style={{marginLeft: 40}} className="btn btn-primary mb-2" onClick={this.onOpenWithdrawModal}>
                                            Withdraw Money
                                        </button>
                                    </div>
                                </div>

                                {
                                    this.state.Add_Money &&
                                        <Modal showCloseIcon={false} open={this.state.openAddModal}
                                               onClose={this.onCloseAddModal} little>
                                            <div className="pf-modal-content">
                                                <form ref="projectForm" className="skills-form">
                                                    <h3 className="pf-modal-title" id="exampleModalLabel">
                                                        <span className="pf-modal-text">Add Money</span>
                                                    </h3>
                                                    <div className="pf-modal-body-skills">
                                                        <div className="input-group">
                                                            <span className="input-group-addon width10">$</span>
                                                            <input type="text" className="form-control" name="Add"
                                                                   ref="Add"
                                                                   placeholder="Add Amount" required={true}/>
                                                        </div>
                                                        <div className="input-group">
                                                <span className="input-group-addon width10">
                                                    <i class="fa fa-credit-card "/>
                                                </span>
                                                            <input type="text" className="form-control" name="Card"
                                                                   ref="Card"
                                                                   placeholder="Card" required={true}/>
                                                        </div>

                                                        <div className="input-group">
                                                            <span className="input-group-addon width10">CVV</span>
                                                            <input type="text" className="form-control" name="CVV"
                                                                   ref="CVV"
                                                                   placeholder="XXX"
                                                                   required={true}/>
                                                        </div>

                                                        <div className="pf-modal-btn-pad-transaction">
                                                            <button type="button"
                                                                    className="btn btn-success pf-modal-save"
                                                                    data-dismiss="modal"
                                                                    onClick={this.handleAddMoney}>Save
                                                            </button>
                                                            <button type="button"
                                                                    className="btn btn-secondary pf-modal-cancel"
                                                                    data-dismiss="modal"
                                                                    onClick={this.onCloseAddModal}>Close
                                                            </button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </Modal>
                                }

                                {
                                    this.state.Withdraw_Money &&
                                    <Modal showCloseIcon={false} open={this.state.openWithdrawModal}
                                           onClose={this.onCloseWithdrawModal} little>
                                        <div className="pf-modal-content">
                                            <form ref="projectForm" className="skills-form">
                                                <h3 className="pf-modal-title" id="exampleModalLabel">
                                                    <span className="pf-modal-text">Withdraw Money</span>
                                                </h3>
                                                <div className="pf-modal-body-skills">
                                                    <div className="input-group">
                                                <span className="input-group-addon width10">
                                                    $
                                                </span>
                                                        <input type="text" className="form-control" name="Withdraw"
                                                               ref="Withdraw"
                                                               placeholder="Withdraw Amount" required={true}/>
                                                    </div>
                                                    <div className="input-group mb-4">
                                                <span className="input-group-addon width10">
                                                    <i class="fa fa-credit-card "/>
                                                </span>
                                                        <input type="text" className="form-control" name="Account"
                                                               ref="Account"
                                                               placeholder="Account Number" required={true}/>
                                                    </div>

                                                    <div className="pf-modal-btn-pad-transaction">
                                                        <button type="button"
                                                                className="btn btn-success pf-modal-save"
                                                                data-dismiss="modal"
                                                                onClick={this.handleWithdrawMoney}>Save
                                                        </button>
                                                        <button type="button"
                                                                className="btn btn-secondary pf-modal-cancel"
                                                                data-dismiss="modal"
                                                                onClick={this.onCloseWithdrawModal}>Close
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </Modal>
                                }

                                {
                                    this.state.my_transaction_details_status &&
                                    <div className="panel panel-primary" id="shadowPanel-bid">
                                        <table>
                                            <thead>
                                            <tr>
                                                <th className='width10 ml-2'>Type</th>
                                                <th className='width10'>From</th>
                                                <th className='width10'>To</th>
                                                <th className='width10'>Amount</th>
                                                <th className='width10'>Date</th>
                                                <th className='width10'>Project ID</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                this.state.my_transaction_details.map((data) =>
                                                    <tr key={data._id}>
                                                        <td className='pl-1'>{data.type}</td>
                                                        <td className='pl-0'><a href={`/ViewProfilePage/${data.from}`}>@{data.from}</a></td>
                                                        <td className='pl-0'><a href={`/ViewProfilePage/${data.to}`}>@{data.to}</a></td>
                                                        <td className='pl-0'>{data.amount}</td>
                                                        <td className='pl-0'>{data.Date}</td>
                                                        <td className='pl-0'>{data.project}</td>
                                                    </tr>
                                                )
                                            }
                                            </tbody>
                                        </table>
                                    </div>
                                }

                                {
                                    !this.state.my_transaction_details_status &&
                                    <div className="panel panel-primary" id="shadowPanel-bid">
                                        <p>No Transactions yet</p>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

function mapStateToProps(state) {

    const { userDetails }  = state;
    return {
        userDetails,
    };

}

export default connect(mapStateToProps)(TransactionsPage);