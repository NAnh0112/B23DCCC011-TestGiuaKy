import { useState, useEffect } from 'react';
import { message } from 'antd';

interface InitModelOptions<T> {
	storageKey: string;
	defaultValue: T;
}

export default function useInitModel<T>({ storageKey, defaultValue }: InitModelOptions<T>) {
	const [data, setData] = useState<T>(defaultValue);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		const loadData = () => {
			try {
				setLoading(true);
				const storedData = localStorage.getItem(storageKey);
				if (storedData) {
					const parsedData = JSON.parse(storedData);
					setData(parsedData);
				}
			} catch (error) {
				console.error(`Error loading data from ${storageKey}:`, error);
				message.error('Không thể tải dữ liệu');
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, [storageKey]);

	const setModelData = (updater: T | ((prev: T) => T)) => {
		setData((prev) => {
			const updatedData = typeof updater === 'function' ? (updater as (prev: T) => T)(prev) : updater;
			try {
				localStorage.setItem(storageKey, JSON.stringify(updatedData));
			} catch (error) {
				console.error(`Error saving data to ${storageKey}:`, error);
				message.error('Không thể lưu dữ liệu');
			}
			return updatedData;
		});
	};

	return { data, setData: setModelData, loading };
}
