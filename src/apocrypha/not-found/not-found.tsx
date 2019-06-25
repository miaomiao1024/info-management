import * as React from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';

export interface NotFoundProps {
    title: string;
    desc?: string;
    prefixCls?: string;
    className?: string;
    children?: React.ReactNode;
}

export default class ComingSoon extends React.Component<NotFoundProps, any>{
    static defaultProps = {
      desc: '',
      prefixCls: 'fui-not-found',
    }
    static propTypes = {
      title: PropTypes.string.isRequired,
      desc: PropTypes.string,
    }

    isNeedInserted() {
        const { children } = this.props;
        return React.Children.count(children) === 1;
    }

    render(){
      const type = "default"
      const { title, desc, prefixCls, className } = this.props;
      const classes = classNames(prefixCls, className, {
        [`${prefixCls}-${type}`]: type,
      });

      return (
        <div className={classes}>
          <div className="header">
            <span>{title}</span>
            {
              desc && <span>{desc}</span>
            }
          </div>
          <div className="content">
          <img
            src="http://apocrypha.didistatic.com/static/fateapocrypha/assets/img/notFound.png"
            alt="未找到此页面" />
          </div>
        </div>
      )
    }
}
