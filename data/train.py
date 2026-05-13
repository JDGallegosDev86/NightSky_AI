import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
import torchvision.transforms as transforms

# Import teh classes from the other files
from dataset import NightSkyDataset
from model import BortleNet

def train_model(model, dataloader, criterion, optimizer, num_epochs=10):
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr= learning_rate)

    # Automatically utilize CUDA (GPU) if available
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Training on device: {device}")
    model.to(device)

    for epoch in range(num_epochs):
        model.train()
        running_loss = 0.0

        for images, labels in train_loader:
            images, labels = images.to(device), labels.to(device)

            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)

            loss.backward()
            optimizer.step()
            running_loss += loss.items()

        print(f"Epoch [{epoch+1}/{num_epochs}], Loss: {running_loss/len(train_loader):.4f}")

    if __name__ == "__main__":
        # --Where the data will be plugged in--
        # empty list to hold the paths to the training images
        dummy_image_paths = []
        dummy_labels = []

        # Standardize image size for the CNN
        transform = transforms.Compose([
            transforms.ToTensor(),
            transforms.Resize((128, 128)),
        ])

        # Initialize custom classes
        train_dataset = NightSkyDataset(dummy_image_paths, dummy_labels, transform=transform)
        

