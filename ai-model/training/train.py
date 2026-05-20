import torch
import torch.nn as nn
import torch.optim as optim

# Import your refined model and the new dataloader function
from model import BortleNet
from data_loader import get_dataloaders 

def train_model(model, dataloaders, criterion, optimizer, num_epochs=10):
    # Automatically utilize CUDA (GPU) or Apple Silicon (MPS) if available
    device = torch.device("cuda" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu")
    print(f"Training on device: {device}")
    model.to(device)

    for epoch in range(num_epochs):
        print(f'\nEpoch {epoch+1}/{num_epochs}')
        print('-' * 10)

        # Each epoch has a training and validation phase
        for phase in ['train', 'val']:
            if phase == 'train':
                model.train()  # Set model to training mode
            else:
                model.eval()   # Set model to evaluate mode

            running_loss = 0.0
            correct_predictions = 0

            # Iterate over data
            for images, labels in dataloaders[phase]:
                images = images.to(device)
                labels = labels.to(device)

                # Zero the parameter gradients
                optimizer.zero_grad()

                # Forward pass: track history only if in train phase
                with torch.set_grad_enabled(phase == 'train'):
                    outputs = model(images)
                    _, preds = torch.max(outputs, 1)
                    loss = criterion(outputs, labels)

                    # Backward pass and optimize only if in training phase
                    if phase == 'train':
                        loss.backward()
                        optimizer.step()

                # Statistics
                running_loss += loss.item() * images.size(0)
                correct_predictions += torch.sum(preds == labels.data)

            epoch_loss = running_loss / len(dataloaders[phase].dataset)
            epoch_acc = correct_predictions.double() / len(dataloaders[phase].dataset)

            print(f'{phase.capitalize()} Loss: {epoch_loss:.4f} | Acc: {epoch_acc:.4f}')

    return model

if __name__ == "__main__":
    # 1. Get the data
    print("Loading datasets...")
    dataloaders, class_names = get_dataloaders(data_dir='../datasets', batch_size=32)
    
    # 2. Initialize the model
    model = BortleNet()
    
    # 3. Define the Loss function and Optimizer
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001) 
    
    # 4. Train the model! (Set to 2 for the smoke test)
    print("Starting training loop...")
    trained_model = train_model(model, dataloaders, criterion, optimizer, num_epochs=2)
    
    # 5. Save the trained model
    torch.save(trained_model.state_dict(), 'bortlenet_weights.pth')
    print("Training complete. Model saved as 'bortlenet_weights.pth'.")