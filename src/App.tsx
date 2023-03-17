import {
  Box,
  Card,
  Container,
  MantineProvider,
  Text,
  Title,
} from "@mantine/core";
import { useState } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function App() {
  const [languages, setLanguages] = useState(() => [
    {
      id: "1",
      language: "C#",
      gradient: { from: "purple", to: "pink", deg: 45 },
    },
    {
      id: "2",
      language: "TypeScript",
      gradient: { from: "indigo", to: "cyan", deg: 45 },
    },
    {
      id: "3",
      language: "Rust",
      gradient: { from: "orange", to: "salmon", deg: 45 },
    },
  ]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id === over?.id) return;

    setLanguages((items) => {
      const activeIndex = items.findIndex((item) => item.id === active.id);
      const overIndex = items.findIndex((item) => item.id === over?.id);

      return arrayMove(items, activeIndex, overIndex);
    });
  };

  const contents = languages.map((language) => (
    <SortableItem
      key={language.id}
      id={language.id}
      title={language.language}
      gradient={language.gradient}
    />
  ));

  return (
    <MantineProvider>
      <Container
        size={"lg"}
        sx={(theme) => ({
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing.md,
        })}
      >
        <Title my={"lg"} align={"center"}>
          The Best Programming Languages
        </Title>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={languages}
            strategy={verticalListSortingStrategy}
          >
            {contents}
          </SortableContext>
        </DndContext>
      </Container>
    </MantineProvider>
  );
}

type Gradient = {
  from: string;
  to: string;
  deg: number;
};

const SortableItem = (props: {
  id: string;
  title: string;
  gradient: Gradient;
}) => {
  const { id, title, gradient } = props;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box
      component={"div"}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        sx={(theme) => ({
          ":hover": {
            cursor: "grab",
          },
          ":active": {
            cursor: "grabbing",
            boxShadow: theme.shadows.md,
            zIndex: 999,
          },
        })}
      >
        <Text
          variant={"gradient"}
          gradient={gradient}
          align={"center"}
          size={"lg"}
          weight={"bold"}
        >
          {title}
        </Text>
      </Card>
    </Box>
  );
};

export default App;
