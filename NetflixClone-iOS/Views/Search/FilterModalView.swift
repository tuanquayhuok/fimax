import SwiftUI

public struct FilterModalView: View {
    @Binding public var filterCriteria: MovieFilterCriteria
    @Environment(\.presentationMode) private var presentationMode
    
    public var body: some View {
        NavigationView {
            ZStack {
                AppColors.backgroundDark.ignoresSafeArea()
                
                ScrollView {
                    VStack(alignment: .leading, spacing: 20) {
                        // Sắp xếp
                        Text("SẮP XẾP THEO")
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(AppColors.textSecondary)
                        
                        Picker("Sắp xếp", selection: $filterCriteria.sortOption) {
                            ForEach(MovieFilterCriteria.SortOption.allCases) { opt in
                                Text(opt.rawValue).tag(opt)
                            }
                        }
                        .pickerStyle(SegmentedPickerStyle())
                        
                        // Thể loại
                        Text("THỂ LOẠI")
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(AppColors.textSecondary)
                        
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack {
                                ForEach(MockData.genres, id: \.self) { g in
                                    Button(action: { filterCriteria.genre = g }) {
                                        Text(g)
                                            .font(.system(size: 13, weight: filterCriteria.genre == g ? .bold : .regular))
                                            .foregroundColor(filterCriteria.genre == g ? .white : AppColors.textSecondary)
                                            .padding(.horizontal, 12)
                                            .padding(.vertical, 6)
                                            .background(filterCriteria.genre == g ? AppColors.primaryRed : AppColors.cardDark)
                                            .cornerRadius(16)
                                    }
                                }
                            }
                        }
                        
                        // Quốc gia
                        Text("QUỐC GIA")
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(AppColors.textSecondary)
                        
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack {
                                ForEach(MockData.countries, id: \.self) { c in
                                    Button(action: { filterCriteria.country = c }) {
                                        Text(c)
                                            .font(.system(size: 13, weight: filterCriteria.country == c ? .bold : .regular))
                                            .foregroundColor(filterCriteria.country == c ? .white : AppColors.textSecondary)
                                            .padding(.horizontal, 12)
                                            .padding(.vertical, 6)
                                            .background(filterCriteria.country == c ? AppColors.primaryRed : AppColors.cardDark)
                                            .cornerRadius(16)
                                    }
                                }
                            }
                        }
                    }
                    .padding(16)
                }
            }
            .navigationTitle("Bộ Lọc Phim")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Xong") { presentationMode.wrappedValue.dismiss() }
                        .foregroundColor(AppColors.primaryRed)
                }
            }
        }
    }
}