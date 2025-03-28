import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function SortableItem(props: any) {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
		id: props['data-row-key'],
	});

	const style = {
		...props.style,
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
}
