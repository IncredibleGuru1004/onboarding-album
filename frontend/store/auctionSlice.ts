import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { Auction, CreateAuctionDto, UpdateAuctionDto } from "@/types/auction";

interface AuctionState {
  auctions: Auction[];
  recentAuctions: Auction[];
  currentAuction: Auction | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuctionState = {
  auctions: [],
  recentAuctions: [],
  currentAuction: null,
  isLoading: false,
  error: null,
};

// Async thunks for API calls

// Fetch all auctions with optional filters
export const fetchAuctions = createAsyncThunk(
  "auctions/fetchAll",
  async (
    filters: { categoryID?: string; userId?: string } | undefined,
    { rejectWithValue },
  ) => {
    try {
      let url = "/api/auctions";
      const params = new URLSearchParams();

      if (filters?.categoryID) params.append("categoryID", filters.categoryID);
      if (filters?.userId) params.append("userId", filters.userId);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to fetch auctions");
      }

      const data = await response.json();
      return data as Auction[];
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An error occurred",
      );
    }
  },
);

// Fetch recent auctions
export const fetchRecentAuctions = createAsyncThunk(
  "auctions/fetchRecent",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/auctions/recent", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(
          error.message || "Failed to fetch recent auctions",
        );
      }

      const data = await response.json();
      return data as Auction[];
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An error occurred",
      );
    }
  },
);

// Fetch single auction by ID
export const fetchAuctionById = createAsyncThunk(
  "auctions/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/auctions/${id}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to fetch auction");
      }

      const data = await response.json();
      return data as Auction;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An error occurred",
      );
    }
  },
);

// Create a new auction
export const createAuction = createAsyncThunk(
  "auctions/create",
  async (auctionData: CreateAuctionDto, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/auctions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(auctionData),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to create auction");
      }

      const data = await response.json();
      return data as Auction;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An error occurred",
      );
    }
  },
);

// Update an auction
export const updateAuctionThunk = createAsyncThunk(
  "auctions/update",
  async (
    { id, data }: { id: number; data: UpdateAuctionDto },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(`/api/auctions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to update auction");
      }

      const responseData = await response.json();
      return responseData as Auction;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An error occurred",
      );
    }
  },
);

// Delete an auction
export const deleteAuctionThunk = createAsyncThunk(
  "auctions/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/auctions/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok && response.status !== 204) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to delete auction");
      }

      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An error occurred",
      );
    }
  },
);

const auctionSlice = createSlice({
  name: "auctions",
  initialState,
  reducers: {
    // Synchronous actions for manual state updates if needed
    setAuctions: (state, action: PayloadAction<Auction[]>) => {
      state.auctions = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentAuction: (state) => {
      state.currentAuction = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all auctions
    builder
      .addCase(fetchAuctions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAuctions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.auctions = action.payload;
      })
      .addCase(fetchAuctions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch recent auctions
    builder
      .addCase(fetchRecentAuctions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecentAuctions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recentAuctions = action.payload;
      })
      .addCase(fetchRecentAuctions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch single auction
    builder
      .addCase(fetchAuctionById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAuctionById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentAuction = action.payload;
      })
      .addCase(fetchAuctionById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create auction
    builder
      .addCase(createAuction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAuction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.auctions.unshift(action.payload);
        state.recentAuctions.unshift(action.payload);
      })
      .addCase(createAuction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update auction
    builder
      .addCase(updateAuctionThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAuctionThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.auctions.findIndex(
          (a) => a.id === action.payload.id,
        );
        if (index !== -1) {
          state.auctions[index] = action.payload;
        }
        const recentIndex = state.recentAuctions.findIndex(
          (a) => a.id === action.payload.id,
        );
        if (recentIndex !== -1) {
          state.recentAuctions[recentIndex] = action.payload;
        }
        if (state.currentAuction?.id === action.payload.id) {
          state.currentAuction = action.payload;
        }
      })
      .addCase(updateAuctionThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete auction
    builder
      .addCase(deleteAuctionThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAuctionThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.auctions = state.auctions.filter((a) => a.id !== action.payload);
        state.recentAuctions = state.recentAuctions.filter(
          (a) => a.id !== action.payload,
        );
        if (state.currentAuction?.id === action.payload) {
          state.currentAuction = null;
        }
      })
      .addCase(deleteAuctionThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setAuctions, clearError, clearCurrentAuction } =
  auctionSlice.actions;

// Selectors
export const selectAuctions = (state: RootState) => state.auctions.auctions;
export const selectRecentAuctions = (state: RootState) =>
  state.auctions.recentAuctions;
export const selectCurrentAuction = (state: RootState) =>
  state.auctions.currentAuction;
export const selectAuctionsLoading = (state: RootState) =>
  state.auctions.isLoading;
export const selectAuctionsError = (state: RootState) => state.auctions.error;

export default auctionSlice.reducer;
