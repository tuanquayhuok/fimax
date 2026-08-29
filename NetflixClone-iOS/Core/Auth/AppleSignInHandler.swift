import Foundation
import AuthenticationServices
import SwiftUI

public class AppleSignInHandler: NSObject, ObservableObject, ASAuthorizationControllerDelegate, ASAuthorizationControllerPresentationContextProviding {
    public var onCompletion: ((UserAccount) -> Void)?
    
    public func performAppleSignIn(completion: @escaping (UserAccount) -> Void) {
        self.onCompletion = completion
        let appleIDProvider = ASAuthorizationAppleIDProvider()
        let request = appleIDProvider.createRequest()
        request.requestedScopes = [.fullName, .email]
        
        let authorizationController = ASAuthorizationController(authorizationRequests: [request])
        authorizationController.delegate = self
        authorizationController.presentationContextProvider = self
        authorizationController.performRequests()
    }
    
    public func authorizationController(controller: ASAuthorizationController, didCompleteWithAuthorization authorization: ASAuthorization) {
        if let appleIDCredential = authorization.credential as? ASAuthorizationAppleIDCredential {
            let userId = appleIDCredential.user
            let email = appleIDCredential.email ?? "apple_user@icloud.com"
            let givenName = appleIDCredential.fullName?.givenName ?? "Apple"
            let familyName = appleIDCredential.fullName?.familyName ?? "User"
            let fullName = "\(givenName) \(familyName)".trimmingCharacters(in: .whitespaces)
            
            let user = UserAccount(
                id: userId,
                name: fullName.isEmpty ? "Người dùng Apple ID" : fullName,
                email: email,
                avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
                planTier: "Thành viên Tiêu chuẩn",
                isVip: false
            )
            self.onCompletion?(user)
        }
    }
    
    public func authorizationController(controller: ASAuthorizationController, didCompleteWithError error: Error) {
        print("Apple Sign In error: \(error.localizedDescription)")
    }
    
    public func presentationAnchor(for controller: ASAuthorizationController) -> ASPresentationAnchor {
        guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
              let window = windowScene.windows.first else {
            return ASPresentationAnchor()
        }
        return window
    }
}