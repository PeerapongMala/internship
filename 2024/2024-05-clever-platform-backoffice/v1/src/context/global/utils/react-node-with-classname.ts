import React from 'react';

/**
 * Wraps a ReactNode and adds a className if the node is a valid React element.
 *
 * @param node - The ReactNode to modify
 * @param className - The className to apply if applicable
 * @returns A modified node with the className if possible
 */
export function withClassName(node: React.ReactNode, className: string): React.ReactNode {
  if (React.isValidElement(node)) {
    return React.cloneElement(node as React.ReactElement<{ className?: string }>, {
      className: [node.props.className, className].filter(Boolean).join(' '),
    });
  }

  return node; // return as-is if it's not a React element
}
