import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

//internal
import urlUtil from '@src/util/urlUtil';

const ContributorBox = React.createClass({
    render: function() {
        let bodyDom;
        const {treesMap, visible, owner, repo, branch} = this.props;
        const trees = _.get(treesMap, 'tree', []);
        const treeCount = _.size(trees);

        if(visible !== true){
            return null;
        }
        else if( treeCount > 0){
            bodyDom = trees.map( (tree) => {
                const path = tree.path;
                const sha = tree.sha;
                const type = tree.type;
                const fileLink = `https://github.com/${owner}/${repo}/tree/${branch}/${path}`
                const key = `blob-${sha}`;

                const typeDom = type === 'tree' ? '> ' : '';

                return (
                    <div key={key}>
                        <a href={fileLink} data-sha={sha}>{typeDom}{path}</a>
                    </div>
                );
            })
        } else {
            bodyDom = <div>Not Available...</div>;
        }

        return (
            <div className="panel panel-primary">
                <div className="panel-heading">
                    <h4>File Explorer</h4>
                </div>
                <div className="panel-body">
                    {bodyDom}
                </div>
            </div>
        );
    }
});


const mapStateToProps = function(state) {
    return {
        treesMap : _.get(state, 'repo.trees', {}),
        visible : _.get(state, 'ui.visible.fileExplorer'),
        repo : _.get( state, 'repo.repo'),
        owner : _.get( state, 'repo.owner'),
        branch: _.get( state, 'repo.branch'),
    };
}

export default connect(mapStateToProps)(ContributorBox);
