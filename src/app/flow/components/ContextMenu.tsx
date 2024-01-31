import { Action } from '@/reasonScore/Action';
import { ClaimActions } from '@/reasonScoreNext/ActionTypes';
import { Button, Menu, MenuItem } from '@blueprintjs/core';
import React, { useCallback, useContext } from 'react'
import { FlowDataContext } from './FlowDataProvider';

export type ContextMenuData = {
    id: string;
    top: number | "false";
    left: number | "false";
    right: number | "false";
    bottom: number | "false";
    onPaneClick: () => void;
};

const ContextMenu = ({ id, top, left, right, bottom, onPaneClick }: ContextMenuData) => {

    const x = useContext(FlowDataContext);

    const deleteNode = () => {
        // TODO: delete all connections to this node and all the descendants and connections to them. Probably need to make a reducer for this specific task
        const claimAction: ClaimActions = {
            type: "delete",
            newData: { id, type: "claim" },
        };

        console.log("deleteNode", claimAction);

        x.dispatch([claimAction]);

        onPaneClick();
    }
    return (
        <Menu
            style={{ top: top, left: left, right: right, bottom: bottom }}
            className='absolute'
        >
            <MenuItem
                onClick={deleteNode}
                icon="trash"
                text="Delete"
            />
        </Menu>
    );
}

export default ContextMenu