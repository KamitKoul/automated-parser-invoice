import React from 'react';
import { Link } from 'react-router-dom';

const LinkWithRef = React.forwardRef((props, ref) => (
  <Link {...props} ref={ref} />
));

export default LinkWithRef;