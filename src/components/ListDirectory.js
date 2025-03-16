import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import ListsDisplay from './ListsDisplay';
import errorImage from './list-creation-failure-lg-output.png';
import { fetchLists, setSelectedLists, resetError } from '../redux/listsSlice';

//const API_URL = 'https://apis.ccbp.in/list-creation/lists';

const Container = styled.div`
position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 1200px;
  height: 100vh;
  padding: 20px;
  background-color: #ffffff;
  overflow: hidden; 
`;

const TopSection = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
  padding: 16px 0;
  border-bottom: 1px solid #eeeeee;
`;

const ListsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin: 20px 0;
  max-height: calc(100vh - 150px);
  overflow-y: auto;
  padding-right: 10px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  background: #0b69ff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  
  &:disabled {
    background: #9aa5b1;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  margin-top: 10px;
  font-size: 25px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  width: 100%;
`;

const ListItemStyled = styled.div`
  padding: 12px;
  border-bottom: 1px solid #eee;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #f9f9f9;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
`;

const ItemName = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const ItemDescription = styled.div`
  font-size: 0.9em;
  color: #666;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end; /* Moves content slightly lower */
  height: 100vh;
  text-align: center;
  background-image: url(${(props) => props.bgImage});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  padding-bottom: 600px; /* Adjust this value to fine-tune */
`;

const RetryButton = styled.button`
  padding: 12px 24px;
  background: #0b69ff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 25px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #0052cc;
  }

  &:disabled {
    background: #9aa5b1;
    cursor: not-allowed;
  }
`;

const ListDirectory = () => {
  const dispatch = useDispatch();
  const { items: lists, status, error, selected } = useSelector((state) => state.lists);
  const [showCreationView, setShowCreationView] = useState(false);
  const [selectionError, setSelectionError] = useState("");

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchLists());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(resetError()), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleListSelect = (listNumber) => {
    const newSelection = selected.includes(listNumber)
      ? selected.filter(num => num !== listNumber)
      : [...selected, listNumber].slice(0, 2);
    
    dispatch(setSelectedLists(newSelection));
    setSelectionError("");
  };

  const handleCreateNewList = () => {
    if (selected.length !== 2) {
      setSelectionError("*You should select exactly 2 lists to create a new list");
      return;
    }
    setShowCreationView(true);
  };

  if (status === 'loading') {
    return (
      <Container>
        <LoadingContainer>
          <div className="loader"></div>
        </LoadingContainer>
      </Container>
    );
  }

  if (error && !showCreationView) {
    return (
      <ErrorContainer bgImage={errorImage}>
        <ErrorMessage>Something went wrong. Please try again</ErrorMessage>
        <RetryButton onClick={() => dispatch(fetchLists())}>Try Again</RetryButton>
      </ErrorContainer>
    );
  }

  if (showCreationView) {
    return (
      <ListsDisplay
        selectedLists={selected}
        onCancel={() => setShowCreationView(false)}
      />
    );
  }

  return (
    <Container>
      <h1 style={{ display: "flex", justifyContent: "center" }}>List Creation</h1>
      <TopSection>
        <Button onClick={handleCreateNewList}>
          Create a new list
        </Button>
      </TopSection>
      {selectionError && <ErrorMessage>{selectionError}</ErrorMessage>}
      <ListsGrid>
        {lists.map((list) => (
          <ListItem 
            key={`list-${list.list_number}`}
            list={list}
            isSelected={selected.includes(list.list_number)}
            onSelect={handleListSelect}
          />
        ))}
      </ListsGrid>
    </Container>
  );
};

const List = styled.div`
  border: 1px solid #e2e8f0;
  padding: 20px;
  border-radius: 8px;
  background: ${props => props.$isSelected ? '#f1f5f9' : 'white'};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  max-height: 500px;
  overflow-y: auto;
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ListTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  h3 {
    margin: 0;
  }
`;

const ItemCount = styled.span`
  background: #e2e8f0;
  color: #475569;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 14px;
`;

const Checkbox = styled.input`
  margin-right: 10px;
`;

const ListItem = ({ list, isSelected, onSelect }) => {
  return (
    <List $isSelected={isSelected}>
      <ListHeader>
        <ListTitle>
        <Checkbox type="checkbox" checked={isSelected} onChange={() => onSelect(list.list_number)} />
          <h3>List {list.list_number}</h3>
          
        </ListTitle>
        
      </ListHeader>
      {list.items.map((item) => (
        <ListItemStyled key={item.id}>
          <ItemName>{item.name}</ItemName>
          <ItemDescription>{item.description}</ItemDescription>
        </ListItemStyled>
      ))}
    </List>
  );
};

export default ListDirectory;