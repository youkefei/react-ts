import React from 'react';
import { connect } from "react-redux";
import './index.css';
import { RigInfoState, MemoState, RealtimeState } from "./store/types";
import { AppState } from "./store";
import {
    RemoveMemoActionCreator,
    GetMemoAsyncDispatchCreator,
    GetRigInfoAsyncDispatchCreator,
    UpdateRealtimeActionCreator
} from "./store/actions";
import { MemoType, RealtimeValueType } from "./connector/pdsaTypes";
import { RealtimeUpdater } from "./connector/pdsa";

interface AppProps {
    removeMemo: typeof RemoveMemoActionCreator;
    getMemo: any;
    getRigInfo: any;
    updateRealtime: any;
    memo: MemoState;
    rigInfo: RigInfoState;
    realtime: RealtimeState;
}

class App extends React.Component<AppProps> {
    getMemosSize() {
        return this.props.memo.memos.length;
    }

    renderMemos() {
        return (
            <>
                {
                    this.props.memo.memos.map((memo: MemoType, index: number) =>
                        <li key={`k-${index}`}>{memo.identifier}, {memo.text}, {memo.creationTime}</li>)
                }
            </>
        )
    };

    renderRealtime() {
        if (this.props.realtime.realtimeValues) {
            return (
                <>
                    {
                        this.props.realtime.realtimeValues.map((realtime: RealtimeValueType, index: number) =>
                            <li key={`k-${index}`}>{realtime.identifier}: {realtime.value}</li>)
                    }
                </>
            )
        }
    };

    componentDidMount() {
        // This is to demo automatically get rig info when the page is loaded.
        this.props.getRigInfo();

        new RealtimeUpdater(this.props.updateRealtime);
    }

    render() {
        return (
            <>
                <div>
                    <p>Rig Information: </p>
                    <ul>
                        <li>Well Name: {this.props.rigInfo.info.name}</li>
                        <li>Time Zone: {this.props.rigInfo.info.timeZone}</li>
                        <li>Operator: {this.props.rigInfo.info.operator}</li>
                        <li>Status: {this.props.rigInfo.info.status}</li>
                    </ul>
                </div>

                <div>
                    <p> Realtime:</p>
                    <ul>
                        {this.renderRealtime()}
                    </ul>
                </div>

                <p>We have {this.props.memo.memos.length} memos</p>

                <p>
                    <button className="button" onClick={this.props.getMemo}>Get Memo</button>
                </p>
                <p>
                    <button className="button" onClick={this.props.removeMemo}>Remove Memo (from client)</button>
                </p>
                <ul>{this.renderMemos()}</ul>
            </>
        )
    };
}


const mapStateToProps = (appState: AppState) => ({
    memo: appState.memoReducer,
    rigInfo: appState.rigInfoReducer,
    realtime: appState.realtimeReducer,
})

const mapDispatchToProps = {
    getMemo: GetMemoAsyncDispatchCreator,
    removeMemo: RemoveMemoActionCreator,
    getRigInfo: GetRigInfoAsyncDispatchCreator,
    updateRealtime: UpdateRealtimeActionCreator,
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
