const addRow = () => {
  const updatedRows = [...rows];
  const newRow = updatedRows[0].map(() => {
    return "";
  });
  updatedRows.push(newRow);
  setRows(updatedRows);
};

<Button icon="plus" mode="text" onPress={addRow} disabled={isLoading}>
  Add row
</Button>;
