import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ListCreationView from './ListCreationView';

const API_URL = 'https://apis.ccbp.in/list-creation/lists';

const Container = styled.div`
  padding: 20px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #ffffff;
  min-height: 100vh;
`;

const TopSection = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 32px;
  padding: 16px 0;
  border-bottom: 1px solid #eeeeee;
`;

const ListsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin: 20px 0;
  max-height: calc(100vh - 150px); // Account for header and margins
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

  /* Scrollbar styling */
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
  &:last-child {
    border-bottom: none;
  }
`;

const ItemName = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const ItemDescription = styled.div`
  font-size: 0.9em;
  color: #666;
`;

const ListsContainer = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLists, setSelectedLists] = useState([]);
  const [showCreationView, setShowCreationView] = useState(false);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch lists. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Raw API Data:', data);

      if (data && Array.isArray(data.lists)) {
        // Group items into two lists
        const list1Items = data.lists.filter((_, index) => index % 2 === 0);
        const list2Items = data.lists.filter((_, index) => index % 2 === 1);

        const formattedLists = [
          {
            list_number: 1,
            items: list1Items.map(item => ({
              id: item.id,
              name: item.name,
              description: item.description
            }))
          },
          {
            list_number: 2,
            items: list2Items.map(item => ({
              id: item.id,
              name: item.name,
              description: item.description
            }))
          }
        ];

        console.log('Formatted Lists:', formattedLists);
        setLists(formattedLists);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (err) {
      console.error('API Error:', err);
      setError('Failed to fetch lists. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleListSelect = (listNumber) => {
    setSelectedLists(prev => {
      if (prev.includes(listNumber)) {
        return prev.filter(num => num !== listNumber);
      }
      if (prev.length < 2) {
        return [...prev, listNumber];
      }
      return prev;
    });
  };

  const handleCreateNewList = () => {
    if (selectedLists.length !== 2) {
      setError('You should select exactly 2 lists to create a new list');
      return;
    }
    setShowCreationView(true);
    setError(null);
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <div className="loader">Loading...</div>
        </LoadingContainer>
      </Container>
    );
  }

  if (error && !showCreationView) {
    return (
      <Container>
        <div>
          <p>{error}</p>
          <Button onClick={fetchLists}>Try Again</Button>
        </div>
      </Container>
    );
  }

  if (showCreationView) {
    return (
      <ListCreationView 
        lists={lists}
        selectedLists={selectedLists}
        onCancel={() => setShowCreationView(false)}
        onUpdate={(updatedLists) => {
          setLists(updatedLists);
          setShowCreationView(false);
          setSelectedLists([]);
        }}
      />
    );
  }

  return (
    <Container>
      <TopSection>
        <Button 
          onClick={handleCreateNewList}
          disabled={selectedLists.length !== 2}
        >
          Create a new list
        </Button>
      </TopSection>
      <ListsGrid>
        {lists.map((list, index) => (
          <ListItem 
            key={`list-${list.list_number}-${index}`}
            list={list}
            isSelected={selectedLists.includes(list.list_number)}
            onSelect={handleListSelect}
          />
        ))}
      </ListsGrid>
      {error && <ErrorMessage>{error}</ErrorMessage>}
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

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
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
  const items = list?.items || [];
  
  return (
    <List $isSelected={isSelected}>
      <ListHeader>
        <ListTitle>
          <h3>List {list.list_number}</h3>
          <ItemCount>{items.length} items</ItemCount>
        </ListTitle>
        <Checkbox
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(list.list_number)}
        />
      </ListHeader>
      {items.map((item) => (
        <ListItemStyled key={item.id}>
          <ItemName>{item.name}</ItemName>
          <ItemDescription>{item.description}</ItemDescription>
        </ListItemStyled>
      ))}
    </List>
  );
};

export default ListsContainer;